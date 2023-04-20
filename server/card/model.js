
const Mongoose = require("mongoose");
const cardSchema = new Mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      description: String,
      placement: {
        type: Number,
        required: true,
      },
      segmentId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Segment",
      },
    },
    
    { timestamps: true }
  );


  class Card {
    static insertCard(cardInfo) {
      const card = this(cardInfo);
  
      return card.save();
    }
  
    static getCardBySegmentId(segmentId) {
      return this.find({ segmentId }).sort("placement").exec();
    }
  
    static updatePlacement(cardId, placement, segmentId) {
      return this.findOneAndUpdate(
        {
          _id: Mongoose.mongo.ObjectID(cardId),
        },
        {
          $set: {
            placement,
            segmentId,
          },
        }
      ).exec();
    }
  }

cardSchema.loadClass(Card);

module.exports = Mongoose.model("Card", cardSchema);