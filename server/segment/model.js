const Mongoose = require("mongoose");


const sectionSchema = new Mongoose.Schema({
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
  
    static insertSection(segmentInfo) {
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
  
  sectionSchema.loadClass(Segment);
  
  module.exports = Mongoose.model("Segment", sectionSchema);