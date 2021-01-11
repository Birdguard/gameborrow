var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeveloperSchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 100},
        date_established: {type:Date},
        date_shutdown: {type:Date}
    }
);

DeveloperSchema
.virtual('lifespan')
.get(function () {
    return '/catalog/developer' + this._id;
});

//Export this model
module.exports = mongoose.model('Developer', DeveloperSchema);