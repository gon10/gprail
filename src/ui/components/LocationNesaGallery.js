import React, { memo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ImageContext from "./Image/ImageContext/ImageContext";
import { getDocuments } from "../../Service/DocumentService";
import { getThumbnail } from "../../Service/AttachmentService";

function LocationNesaGallery(props) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      let promises = [];
      let uniqueCodesSequence = new Map();
      if (
        props.input.boundFieldNames &&
        Array.isArray(props.input.boundFieldNames)
      ) {
        props.input.boundFieldNames.forEach((fieldName) => {
          if (props.data[fieldName]) {
            props.data[fieldName].forEach((loc) => {
              loc.engineeringLocations.forEach((ele) => {
                if (!uniqueCodesSequence.get(`${ele.code}${ele.sequence}`)) {
                  const params = new URLSearchParams({ collectionName: 'network-gbr-nesaDiagram' })

                  const code = {
                    name: "lineOfRoute.0.code",
                    filter: ele.code
                  };

                  const sequence = {
                    name: "sequence",
                    filter: ele.sequence
                  };

                  [code, sequence].forEach(field => {
                    if (typeof field.filter !== "undefined") {
                      params.append("fields[]", JSON.stringify(field));
                    }
                  });

                  const queryParams = params.toString()
                  promises.push(getDocuments(queryParams));
                  uniqueCodesSequence.set(`${ele.code}${ele.sequence}`, {
                    sequence: ele.sequence,
                    code: ele.code,
                  });
                }
              });
            });
          }
        });
      } else if (
        props.input.boundFieldNames &&
        !Array.isArray(props.input.boundFieldNames)
      ) {
        if (props.data[props.input.boundFieldNames]) {
          props.data[props.input.boundFieldNames].forEach((loc) => {
            loc.engineeringLocations.forEach((ele) => {
              if (!uniqueCodesSequence.get(`${ele.code}${ele.sequence}`)) {
                const params = new URLSearchParams({ collectionName: 'network-gbr-nesaDiagram' })
                
                const code = {
                  name: "lineOfRoute.0.code",
                  filter: ele.code
                };

                const sequence = {
                  name: "sequence",
                  filter: ele.sequence
                };

                [code, sequence].forEach(field => {
                  if (typeof field.filter !== "undefined") {
                    params.append("fields[]", JSON.stringify(field));
                  }
                });

                const queryParams = params.toString()
                promises.push(getDocuments(queryParams));
                uniqueCodesSequence.set(`${ele.code}${ele.sequence}`, {
                  sequence: ele.sequence,
                  code: ele.code,
                });
              }
            });
          });
        }
      }

      try {
        setError(false)
        setLoading(true)
        const results = await Promise.allSettled(promises);
        const successfulResults = results.filter(
          (result) => result.status === "fulfilled"
        );
        const items = [];
        successfulResults.forEach((element) => {
          if (element.value.data && element.value.data.success)
          items.push(element.value.data.data[0]);
        });
        
        setItems(items);
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    };

    if (props && props.data && props.input) {
      fetchData();
    }
  }, [props]);

  // let images = [];
  useEffect(() => {

    if (items && items.length > 0) {
      items.forEach((item, index) => {
        if (item && item.diagram && Array.isArray(item.diagram)) {
          const images = item.diagram.map((diag) => ({
            id: `${diag._id["$oid"]}${index}`,
            title: `${diag.lineOfRoute[0].code}`,
            alt: `${diag.lineOfRoute[0].name}`,
            src: diag.diagram.attachmentId
              ? getThumbnail(item.diagram.attachmentId)
              : null,
          }));

          setImages(images);
        } else {
          setImages(prevImages => [...prevImages, {
            id: `${item._id["$oid"]}${index}`,
            title: `${item.lineOfRoute[0].code}`,
            alt: `${item.lineOfRoute[0].name}`,
            src: item.diagram.attachmentId
              ? getThumbnail(item.diagram.attachmentId)
              : null,
          }])
        }
      });
    }
  }, [items])

  function filmstripClick(e) {
    // const thisImageId = e.currentTarget.id;
    // navigate("/app/splitscreen/view", { state: { id: thisImageId } });
  }
  
  function handleImageClick(e) {
    const imageId = e.currentTarget.id;

    images.forEach(image => {
      if(image.id === imageId) {
        setSelectedImage(image)
      }
    })
  }

  if (error) {
    return <p>Could not load Location Nesa Gallery</p>
  }

  if (loading) {
    return <p>Loading Location NESA Gallery...</p>
  }

  return (
    <>
      {images.length > 0 ? (
        <div>
          Location Nesa Gallery:
          {images && images.length > 0 && (
            <ImageContext
              id={selectedImage ? selectedImage.id : ''}
              alt={selectedImage ? selectedImage.alt : ''}
              src={selectedImage ? selectedImage.src : ''}
              images={images}
              disabled={false}
              type={"gallery"}
              // size={size}
              onClick={handleImageClick}
              helpText={""}
              filmstripClick={filmstripClick}
            />
          )}
        </div>
      ) : (
        <div>Location Nesa Gallery is empty</div>
      )}
    </>
  );
}

export default memo(LocationNesaGallery);