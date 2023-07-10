export function createImageContextImages(items){
   let images = [];
   if(Array.isArray(items.diagram)){
      images = items.diagram.map(item => {console.log("item",item);return({
        id: item._id['$oid'],
        title: `${item.lineOfRoute[0].code}`,
        alt: `${item.lineOfRoute[0].name}`,
        src: item.diagram.attachmentId? getThumbnail(item.diagram.attachmentId) : null
      })} )
    }
    else if(items && items._id && items.lineOfRoute && items.diagram) {
      images.push({
        id: items._id['$oid'],
        title: `${items.lineOfRoute[0].code}`,
        alt: `${items.lineOfRoute[0].name}`,
        src: items.diagram.attachmentId? getThumbnail(items.diagram.attachmentId) : null
      })
    }
    return images;
}

export function getThumbnail(id, thumbnailWidth) {

   return `${process.env.REACT_APP_BASE_URL}/api/railhub/attachment/${id}.png?${thumbnailWidth ? thumbnailWidth : "thumbnailWidth=150"}`
  
}