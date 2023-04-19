const updateSegmentPlacement = async (__, args, cxt) => {
  try {
    const segmentId = args.request.segmentId;
    const placement = args.request.placement;

    const segment = await cxt.segment.updateSegmentPlacement(segmentId, placement);
    console.log("segment", segment);
    cxt.publisher.publish(cxt.CONSTANTS.ON_SECTION_PLACEMENT_CHANGE, {
      onSectionPlacementChange: segment,
    });

    return segment;
  } catch (e) {
    console.log("Error =>", e);
    return null;
  }
};

const insertSegment = async (__, args, cxt) => {
    try {
      const segmentInfo = {
        title: args.request.title,
        label: args.request.label,
        placement: args.request.placement,
      };
  
      const segment = await cxt.section.insertSegment(segmentInfo);
  
      cxt.publisher.publish(cxt.CONSTANTS.SEGMENT_ADDED, {
        segmentAdded: segment,
      });
  
      return segment;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

module.exports = {
    insertSegment,
    updateSegmentPlacement,
  };