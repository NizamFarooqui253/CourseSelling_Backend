const mongoose=require('mongoose');


const CourseSchema=mongoose.Schema({
  // title dec image price

  title:{
    type:String,
    require:true

  },
  description:{
    type:String,
    require:true
    
  },
  //db me image ka url aur public_id save ho taaki jab user humse image maange toh usko ye public aur url de sakke taaki jaha humri jis bhi platform pr image upload ho woh platform public id se usse image de de..
  image:{
    public_id:{
      type:String,
    require:true

    },
    url:{
      type:String,
    require:true
    }
    
  },
  price:{
    type:Number,
    require:true
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "user", // payload k varibale ka referenece hai   ex req.user=user 👈;
  },

})


const CourseDB=mongoose.model("Course",CourseSchema)

exports.CourseDB=CourseDB