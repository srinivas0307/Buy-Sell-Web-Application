const mongoose = require('mongoose');

const items=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:String,required:true,enum:['Electronics','Clothing','Books','Grocery','Others']},
    description:{type:String,required:true},
    sellername:{type:String,required:true},
    sellerid:{type:String,required:true},
})

const itemModel=mongoose.model('items',items);

module.exports=itemModel;