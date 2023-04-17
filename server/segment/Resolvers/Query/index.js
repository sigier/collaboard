const fetchSegments = async (__, args, cxt) => {
    try {
      const segments = await cxt.segment.getSegments();
  
      return segments;
    } catch (e) {
      console.log("Error => ", e);
  
      return null;
    }
  };

module.exports = {
    fetchSegments,
};