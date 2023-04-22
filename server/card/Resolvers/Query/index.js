const fetchCardsBySegmentId = async (__, args, cxt) => {
    try {
      const segmentId = args.request.segmentId;
  
      const cards = await cxt.card.getCardBySegmentId(segmentId);
  
      return cards;
    } catch (e) {
      console.log("Error =>", e);
      return null;
    }
  };

  module.exports = {
    fetchCardsBySegmentId,
  };