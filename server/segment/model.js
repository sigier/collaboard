const Mongoose = require("mongoose");


const segmentSchema = new Mongoose.Schema({
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
  });
  
  class Segment {
    static getSegments() {
      return this.find().sort("placement").exec();
    }
  
    static getSegmentById(segmentId) {
      return this.findOne({
        _id: Mongoose.mongo.ObjectID(segmentId),
      }).exec();
    }
  
    static insertSegment(segmentInfo) {
      const segment = this(segmentInfo);
  
      return segment.save();
    }
  
    static updatePlacement(segmentId, placement) {
      return this.findOneAndUpdate(
        {
          _id: Mongoose.mongo.ObjectID(segmentId),
        },
        {
          $set: {
            placement,
          },
        },
        {
          new: true,
        }
      ).exec();
    }
  }
  
  segmentSchema.loadClass(Segment);
  
  module.exports = Mongoose.model("Segment", segmentSchema);