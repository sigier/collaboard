export default function (removedIndex, addedIndex, array) {
    let placement;
    if (addedIndex === array.length - 1) {
        placement = array[array.length - 1].placement + 16384;
    } else if (addedIndex === 0) {
        placement = array[0].placement / 2;
    } else if (addedIndex < removedIndex) {
      let beforePlacement = array[addedIndex - 1].placement;
      let afterPlacement = array[addedIndex].placement;
  
      placement = (beforePlacement + afterPlacement) / 2;
    } else if (addedIndex > removedIndex) {
      let beforePlacement= array[addedIndex + 1].placement;
      let afterPlacement = array[addedIndex].placement;
  
      placement = (beforePlacement + afterPlacement) / 2;
    }
  
    return placement;
  }