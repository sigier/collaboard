const insertCard = async (__, args, cxt) => {
    try {
      const cardInfo = {
        title: args.request.title,
        label: args.request.label,
        pos: args.request.placement,
        segmentId: args.request.segmentId,
      };
  
      const card = await cxt.card.insertCard(cardInfo);
  
      cxt.publisher.publish(cxt.CONSTANTS.CARD_ADDED, {
        cardAdded: card,
      });
  
      return card;
    } catch (e) {
      console.log("Error =>", e);
  
      return null;
    }
  };

const updateCardPlacement = async (__, args, cxt) => {
    try {
      const cardId = args.request.cardId;
      const placement = args.request.placement;
      const segmentId = args.request.segmentId;
      const card = await cxt.card.updatePlacement(cardId, placement, segmentId);
  
      return card;
    } catch (e) {
      console.log("Error => ", e);
  
      return null;
    }
  };


  module.exports = {
    insertCard,
    updateCardPlacement,
  };