const mongoose = require('mongoose');

const salesaudioschema = new mongoose.Schema({
    leadId: {
        type: String,
        required: true
    },
    empName: {
        type: String,
        required: true
    },
    customerPan: {
        type: String,
        required: true
    },
    name: String,
    audio: Buffer, // Store audio file as a Buffer
    contentType: String // MIME type of the audio file
});

const SalesAudio = mongoose.model('SalesAudio', salesaudioschema);

module.exports = SalesAudio;
