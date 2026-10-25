// Display the registered source bytes. This module has no student-state or AI access.
let library;
function pdfLibrary(){
 return library??=import('./vendor/pdfjs/pdf.min.js').then(pdf=>{
  pdf.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.js',import.meta.url).href;
  return pdf;
 }).catch(error=>{library=null;throw error;});
}

export function mountPaperPDF(container,{sourceId,onError=()=>{}}){
 if(!['Pei2019','Zhang2015','Niu2024'].includes(sourceId))throw Error('Unknown paper');
 const controller=new AbortController(),pages=[];
 let documentTask,pdf,intersection,resize,disposed=false,version=0,width=0,queue=Promise.resolve();
 const active=new Set();
 const abort=()=>new DOMException('Reading cancelled','AbortError');
 const report=error=>{if(!disposed&&!['RenderingCancelledException','AbortException','AbortError'].includes(error.name))onError(error);};
 function destroy(){
  if(disposed)return;
  disposed=true;controller.abort();intersection?.disconnect();resize?.disconnect();
  for(const task of active)task.cancel();active.clear();
  for(const item of pages){item.textTask?.cancel();for(const canvas of item.element.querySelectorAll('canvas')){canvas.width=0;canvas.height=0;}}
  documentTask?.destroy().catch(()=>{});
  container.replaceChildren();delete container.dataset.pdfReady;delete container.dataset.pdfSource;delete container.dataset.pageCount;
 }
 async function draw(item,drawWidth,drawVersion){
  if(disposed||drawVersion!==version||item.element.dataset.rendered==='true')return;
  const scale=drawWidth/item.original.width,viewport=item.page.getViewport({scale});
  const outputScale=Math.min(window.devicePixelRatio||1,2);
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
  canvas.width=Math.ceil(viewport.width*outputScale);canvas.height=Math.ceil(viewport.height*outputScale);
  const text=document.createElement('div');text.className='textLayer';
  text.style.setProperty('--total-scale-factor',String(scale));text.style.setProperty('--scale-factor',String(scale));
  item.element.replaceChildren(canvas,text);
  const render=item.page.render({canvasContext:canvas.getContext('2d'),viewport,background:'rgb(255,255,255)',transform:outputScale===1?null:[outputScale,0,0,outputScale,0,0]});
  active.add(render);
  try{
   await render.promise;
   if(disposed||drawVersion!==version)return;
   const api=await pdfLibrary();
   item.textTask=new api.TextLayer({textContentSource:item.page.streamTextContent(),container:text,viewport});
   await item.textTask.render();
   if(!disposed&&drawVersion===version)item.element.dataset.rendered='true';
  }finally{active.delete(render);}
 }
 function enqueue(item){
  if(disposed||!width)return Promise.resolve();
  const currentVersion=version,currentWidth=width;
  const next=queue.then(()=>draw(item,currentWidth,currentVersion));
  queue=next.catch(report);return next;
 }
 function refresh(){
  if(disposed||!pages.length)return;
  const style=getComputedStyle(container);
  const nextWidth=Math.floor(container.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight));
  if(nextWidth<=0||nextWidth===width)return;
  width=nextWidth;version++;
  for(const task of active)task.cancel();
  for(const item of pages){item.textTask?.cancel();delete item.element.dataset.rendered;}
  const view=container.getBoundingClientRect();
  for(const item of pages){const box=item.element.getBoundingClientRect();if(box.bottom>=view.top-400&&box.top<=view.bottom+400)enqueue(item).catch(()=>{});}
 }
 const ready=(async()=>{
  const api=await pdfLibrary();if(disposed)throw abort();
  const response=await fetch(`./api/paper/${sourceId}`,{signal:controller.signal});
  if(!response.ok||!response.headers.get('Content-Type')?.includes('application/pdf'))throw Error('PDF unavailable');
  const data=new Uint8Array(await response.arrayBuffer());if(disposed)throw abort();
  documentTask=api.getDocument({data,isEvalSupported:false,useWasm:false,useSystemFonts:true});
  pdf=await documentTask.promise;if(disposed)throw abort();
  container.replaceChildren();container.dataset.pdfSource=sourceId;container.dataset.pageCount=String(pdf.numPages);
  for(let number=1;number<=pdf.numPages;number++){
   const page=await pdf.getPage(number);if(disposed)throw abort();
   const original=page.getViewport({scale:1}),element=document.createElement('section');
   element.className='pdf-content-page';element.style.aspectRatio=`${original.width} / ${original.height}`;
   element.setAttribute('role','region');element.setAttribute('aria-label',`第 ${number} 页，共 ${pdf.numPages} 页`);element.dataset.pdfPage=String(number);
   container.append(element);pages.push({page,original,element});
  }
  const style=getComputedStyle(container);width=Math.floor(container.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight));
  if(width<=0)width=600;
  await draw(pages[0],width,version);if(disposed)throw abort();
  container.dataset.pdfReady='true';
  intersection=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){const item=pages[Number(entry.target.dataset.pdfPage)-1];enqueue(item).catch(()=>{});}
  },{root:container,rootMargin:'400px'});
  for(const item of pages)intersection.observe(item.element);
  resize=new ResizeObserver(refresh);resize.observe(container);refresh();
 })();
 return {ready,destroy,refresh};
}
