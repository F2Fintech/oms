require('dotenv').config();
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const status = require('express-status-monitor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Audio = require('./models/uploadrecording');
const OpsRec = require('./models/OpsRecording');
const SalesAudio = require('./models/SalesRecording');
const Doctor = require('./models/Doctor');




const app = express();
const PORT = 5000
app.use(status());
// Middleware to set no-cache headers for all routes
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const recordingUpload = multer();


// Database connection (MongoDB)
mongoose.connect("mongodb://localhost:27017/may24-oms")
.then((e) => console.log("Mongodb connected"));


// Function to generate JWT token
function generateToken() {
  const random = Math.round(Math.random() * 1000000000);
  const timestamp = Math.floor(Date.now() / 1000);
  const secretKey = "UTA5U1VEQXdNREF4TWpjM1QwUm5lRTFFV1hkTlJFVjZUbEU5UFE9PQ=="; // Replace with your actual secret key

  const token = require('jsonwebtoken').sign({
      iss: "PSPRINT",
      timestamp: timestamp,
      partnerId: "CORP00001277",
      product: "WALLET",
      reqid: random
  }, secretKey, {
      algorithm: 'HS256'
  });

  return token;
}

app.post('/check-doctor-cibil', async (req, res) => {
  const { name, mobile, document_id} = req.body;

  if (!name || !mobile || !document_id) {
      return res.status(400).json({ error: 'Please fill all fields!!!' });
  }


  try {
  // Save user details to MongoDB
  const doctor = new Doctor({ name, mobile, document_id });
  await doctor.save();

  const token = generateToken();

  const options = {
      method: 'POST',
      url: 'https://api.verifya2z.com/api/v1/verification/credit_report_checker',
      headers: {
          accept: 'application/json',
          Token: token,
          authorisedkey: 'T0RneE1EWXdNREV6TlRFME5UbERUMUpRTURBd01ERXlOemM9',
          'User-Agent': 'CORP00001277',
          'content-type': 'application/json'
      },
      data: {
          name,
          mobile,
          document_id
      }
  };

   const response = await axios.request(options);
  res.json(response.data);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});


// Handle file uploads for both Audio and OpsAudio models
app.post('/rec', recordingUpload.single('audio'), async (req, res) => {
    try {
      const { leadId, empName, customerPan, type } = req.body;
     
       // Check if the customer PAN exists in the database
        const customerExists = await Data.findOne({ customerPan });

        if (!customerExists) {
            return res.status(400).json({ message: 'Customer PAN does not exist' });
        }
      
      // Determine the Content-Type based on the file extension
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase(); // Extract file extension
        let contentType = '';
        switch (fileExtension) {
    case 'aac':
        contentType = 'audio/aac';
        break;
    case 'wav':
        contentType = 'audio/wav';
        break;
    case 'mp3':
        contentType = 'audio/mpeg';
        break;
    case 'm4a':
        contentType = 'audio/mp4';
        break;
    case 'flac':
        contentType = 'audio/flac';
        break;
    case 'ogg':
        contentType = 'audio/ogg';
        break;
    case 'aif':
    case 'aiff':
        contentType = 'audio/aiff';
        break;
    case 'wma':
        contentType = 'audio/x-ms-wma';
        break;
        case 'amr':
          contentType = 'audio/amr';
          break;
    // Add more cases for other audio file types if needed
    default:
        contentType = 'application/octet-stream'; // Default to binary data
        break;
}


        if (type === 'ops') {
            // Handle OpsAudio recording upload
          const opsAudio = new OpsRec({
                leadId: leadId,
                 empName: empName,
                
                customerPan: customerPan,
                name: req.file.originalname,
                audio: req.file.buffer,
                contentType: contentType
            });

            await opsAudio.save();
          res.send('Ops recording uploaded successfully!');
          
        } else if (type === 'sales') {
          // Handle SalesAudio recording upload
          const salesAudio = new SalesAudio({
            leadId: leadId,
            empName: empName,
            customerPan: customerPan,
            name: req.file.originalname,
            audio: req.file.buffer,
            contentType: contentType
          });

          await salesAudio.save();
          res.send('Sales recording uploaded successfully!');
        }
        else {
            // Handle Audio recording upload
            const audio = new Audio({
              leadId: leadId,
              empName: empName,
              customerPan: customerPan,
                name: req.file.originalname,
                audio: req.file.buffer,
                contentType: contentType
            });

            await audio.save();
            res.send('Audio uploaded successfully!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading audio');
    }
});


app.get('/audio', async (req, res) => {
    try {
        const audio = await Audio.find();
        res.json(audio);
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).json({ error: 'Error fetching audio' });
    }
});



app.get('/opsaudio', async (req, res) => {
    try {
        const opsAudio = await OpsRec.find();
        res.json(opsAudio);
    } catch (error) {
        console.error('Error fetching ops audio:', error);
        res.status(500).json({ error: 'Error fetching ops audio' });
    }
});

app.get('/salesaudio', async (req, res) => {
    try {
        const salesAudio = await SalesAudio.find();
        res.json(salesAudio);
    } catch (error) {
        console.error('Error fetching sales audio:', error);
        res.status(500).json({ error: 'Error fetching sales audio' });
    }
});

// Route to fetch data
app.get('/data', async (req, res) => {
    try {
        
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Serve audio files
app.get('/audio/:id', async (req, res) => {
    try {
        const audio = await Audio.findById(req.params.id);

        if (!audio) {
            return res.status(404).send('Audio not found');
        }

        res.set('Content-Type', audio.contentType);
        res.send(audio.audio);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching audio');
    }
});

// Serve audio files for OpsRec
app.get('/opsrec/audio/:id', async (req, res) => {
    try {
        const opsRec = await OpsRec.findById(req.params.id);

        if (!opsRec || !opsRec.audio) {
            return res.status(404).send('OpsRec audio not found');
        }

        res.set('Content-Type', opsRec.contentType);
        res.send(opsRec.audio);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching OpsRec audio');
    }
});

// Serve audio files for OpsRec
app.get('/sales/audio/:id', async (req, res) => {
    try {
        const salesRec = await SalesAudio.findById(req.params.id);

        if (!salesRec || !salesRec.audio) {
            return res.status(404).send('OpsRec audio not found');
      }
      
      res.set('Content-Disposition', 'inline');
        res.set('Content-Type', salesRec.contentType);
        res.send(salesRec.audio);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Sales audio');
    }
});


// register and login

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String
  });
  const User = mongoose.model('User', userSchema);

  // Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  // Register User
  // Register User
    app.post('/reg', async (req, res) => {
    try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ username: req.body.username, email: req.body.email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering new user' });
    }
  });

  
  // Login User
  app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user && await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign({ username: user.username}, 'fintechfinancialfintechfinancialf2');
        res.json({ accessToken: accessToken});
      } else {
        res.status(400).send('Username or password is incorrect');
      }
    } catch {
      res.status(500).send('Error logging in user');
    }
  });
  // Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
  });

// Mongoose Schema and Model for Data
const dataSchema = new mongoose.Schema({
  
    dateOfLogin: {
        type: String, // Store as a string
    },
    employeeIdOfCaseOwner: String,
    adharCard: String,
    employeeName: String,
    dateOfBirth: {
        type: String, // Store as a string
        set: (v) => {
            // Convert to 'DD-MM-YYYY' format
            const date = new Date(v);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    },
    managerName: String,
    employementType: String,
    branchName: String,
    customerName: String,
    customerContact: String,
    mailId: String,
    customerPan: {
        type: String,
        required: true,
        minlength: 10,  // Minimum length of Aadhaar number
        maxlength: 10,  // Maximum length of Aadhaar number
        match: /^[0-9a-zA-Z]+$/,  // Regex to allow only alphanumeric characters (both digits and letters)
      },
    motherName: String,
    nominee: String,
    customerPermanentAddress: String,
    customerCurrentAdd: String,
    officeAddressWithPin: String,
    pinCode: String,
    state: String,
    city: String,
    customerOccupation: String,
    requiredLoanType: String,
    requiredLoanAmount: Number,
    latestCIBILScore: String,
    bankingPassAndOtherDocPass: String,
    toBeLoggedInFromWhichLender: String,
    remarks: String,
    uniqueno: String,
    files:[String]
});



// ops teams schema

const opsTeamSchema = new mongoose.Schema({
  pocName: String,
  customerPan: String,
  uniqueno: String,
  docCheckStatus: String,
  docCheckBy: String,
  tvrStatus: String,
  tvrDoneBy: String,
  eligibilityCheckStatus: String,
  eligibilityCheckBy: String,
  loginStatus: String,
  loginDoneBy: String,
  loginDate: String,
  leadId: String,
  caseStatus: String,
  kfs: String,
  lastUpdateDate: String,
  appovalDate: String,
  disbursalDate: String,
  opsRemarks: String,
  casePendingFrom: String,
  bankerName: String,
  bankerNo: String,
  bankerMail: String,
  cashBackAmount: String,
  finalApproval: String,
  finalDisbAmnt: String,
  highDegree:String,
  regYear:String,
  totalActiveLoanCountAmount:String,
  creditCardStatus:String,
  bounIn6Month:String,
  enquariesIn6Month:String,
  totalSal:String,
  totalExtraIncome:String,
  totalCalculatedSal: String,
  elgibilityType: String,
  creditSuggLender: String,
  creditRemarks: String
})

// Nisha Schema
const nishaDataSchema = new mongoose.Schema({
  dateOfLogin: {
    type: String, // Store as a string
},
employeeIdOfCaseOwner: String,
adharCard: String,
employeeName: String,
dateOfBirth: {
    type: String, // Store as a string
    set: (v) => {
        // Convert to 'DD-MM-YYYY' format
        const date = new Date(v);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
},
managerName: String,
employementType: String,
branchName: String,
customerName: String,
customerContact: String,
mailId: String,
customerPan: {
    type: String,
    // required: true,
    minlength: 10,  // Minimum length of Aadhaar number
    maxlength: 10,  // Maximum length of Aadhaar number
    match: /^[0-9a-zA-Z]+$/,  // Regex to allow only alphanumeric characters (both digits and letters)
  },
customerPermanentAddress: String,
customerCurrentAdd: String,
officeAddressWithPin: String,
pinCode: String,
state: String,
city: String,
customerOccupation: String,
requiredLoanType: String,
requiredLoanAmount: String,
latestCIBILScore: String,
bankingPassAndOtherDocPass: String,
toBeLoggedInFromWhichLender: String,
remarks: String,
files:[String],

})

const nishaOpsDataSchema = new mongoose.Schema({
  pocName: String,
  docCheckStatus: String,
  docCheckBy: String,
  tvrStatus: String,
  tvrDoneBy: String,
  eligibilityCheckStatus: String,
  eligibilityCheckBy: String,
  loginStatus: String,
  loginDoneBy: String,
  loginDate: String,
  leadId: String,
  caseStatus: String,
  appovalDate: String,
  disbursalDate: String,
  opsRemarks: String,
  casePendingFrom: String,
  bankerName: String,
  bankerNo: Number,
  bankerMail: String,
  cashBackAmount: String,
  highDegree:String,
  regYear:String,
  totalActiveLoanCountAmount:String,
  creditCardStatus:String,
  bounIn6Month:String,
  enquariesIn6Month:String,
  totalSal:String,
  totalExtraIncome:String
})


// its give update date and time
dataSchema.pre('save', function(next) {
    const now = new Date();
    this.dateOfLogin = formatDate(now);
    next();
});

// for ops form 
opsTeamSchema.pre('save', function(next) {
  const now = new Date();
  this.loginDate = formatDate(now);
 
  next();
});



// Function to format the date
function formatDate(date) {
    // Format the date to 'YYYY-MM-DD HH:mm:ss'
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// Pre-save hook to generate unique number before saving
dataSchema.pre('save', function(next) {
  if (!this.uniqueno) {
    this.uniqueno = generateUniqueNumber();
  }
  next();
});

// Function to generate a random 6-character alphanumeric string
function generateUniqueNumber() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const Data = mongoose.model('Data', dataSchema);
const OpsData = mongoose.model('OpsData',opsTeamSchema);
const NishaData = mongoose.model('NishaData',nishaDataSchema);
const NishaOpsData = mongoose.model('NishaOpsData',nishaOpsDataSchema);
// model  for furkan
const FurkanData = mongoose.model('FurkanData',nishaDataSchema);
const FurkanOpsData = mongoose.model('FurkanOpsData',nishaOpsDataSchema);

// model for anit
const AnitData = mongoose.model('AnitData',nishaDataSchema);
const AnitOpsData = mongoose.model('AnitOpsData',nishaOpsDataSchema);

// model for anurandhan
const AnurandhanData = mongoose.model('AnurandhanData',nishaDataSchema);
const AnurandhanOpsData = mongoose.model('AnurandhanOpsData',nishaOpsDataSchema);

// model for manoj
const ManojData = mongoose.model('ManojData',nishaDataSchema);
const ManojOpsData = mongoose.model('ManojOpsData',nishaOpsDataSchema);

// credit team muskan
const MuskanData = mongoose.model("MuskanData",nishaDataSchema);
const MuskanOpsData = mongoose.model("MuskanOpsData",nishaOpsDataSchema);

// credit team aaditi
const AaditiData = mongoose.model("AaditiData",nishaDataSchema);
const AaditiOpsData = mongoose.model("AaditiOpsData",nishaOpsDataSchema);







// Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });



// Route to upload Nisha's data
app.post('/opsassign/nisha', async (req, res) => {
  try {
    const { item,opsData } = req.body;
    // console.log(item);
    // console.log(opsData);
    const newNishaOpsData = new NishaOpsData(opsData);
      await newNishaOpsData.save();
      const newNishaData = new NishaData(item);
      await newNishaData.save();
      
      res.status(200).json({ message: 'Data assigned to Nisha successfully' });
  } catch (error) {
      console.error('Error assigning data to Nisha', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload furkan data
app.post('/opsassign/furkan', async (req, res) => {
  try {
    const { item,opsData } = req.body;
    console.log(item);
    console.log(opsData);
    const newFurkanOpsData = new FurkanOpsData(opsData);
      await newFurkanOpsData.save();
      const newFurkanData = new FurkanData(item);
      await newFurkanData.save();
      
      res.status(200).json({ message: 'Data assigned to furkan  successfully' });
  } catch (error) {
      console.error('Error assigning data to Furkan', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload anit data
app.post('/opsassign/anit', async (req, res) => {
  try {
    const { item,opsData } = req.body;
    console.log(item);
    console.log(opsData);
    const newAnitOpsData = new AnitOpsData(opsData);
      await newAnitOpsData.save();
      const newAnitData = new AnitData(item);
      await newAnitData.save();
      
      res.status(200).json({ message: 'Data assigned to anir  successfully' });
  } catch (error) {
      console.error('Error assigning data to Anit', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload anurandhan data
app.post('/opsassign/anurandhan', async (req, res) => {
  try {
    const { item,opsData } = req.body;
      console.log(item);
      console.log(opsData);
      const newAnurandhanOpsData = new AnurandhanOpsData(opsData);
       await newAnurandhanOpsData.save();
      const newAnurandhanData = new AnurandhanData(item);
      await newAnurandhanData.save();
      
      res.status(200).json({ message: 'Data assigned to anurandhan  successfully' });
  } catch (error) {
      console.error('Error assigning data to anurandhan', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload Manoj data
app.post('/opsassign/manoj', async (req, res) => {
  try {
    const { item,opsData } = req.body;
      console.log(item);
      console.log(opsData);
      const newManojOpsData = new ManojOpsData(opsData);
       await newManojOpsData.save();
      const newManojData = new ManojData(item);
      await newManojData.save();
      
      res.status(200).json({ message: 'Data assigned to manoj  successfully' });
  } catch (error) {
      console.error('Error assigning data to manoj', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload Muskan data
app.post('/opsassign/muskan', async (req, res) => {
  try {
    const { item,opsData } = req.body;
      console.log(item);
      console.log(opsData);
      const newMuskanOpsData = new MuskanOpsData(opsData);
       await newMuskanOpsData.save();
      const newMuskanData = new MuskanData(item);
      await newMuskanData.save();
      
      res.status(200).json({ message: 'Data assigned to muskan  successfully' });
  } catch (error) {
      console.error('Error assigning data to muskan', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to upload Aaditi data
app.post('/opsassign/aaditi', async (req, res) => {
  try {
    const { item,opsData } = req.body;
      console.log(item);
      console.log(opsData);
      const newAaditiOpsData = new AaditiOpsData(opsData);
       await newAaditiOpsData.save();
      const newAaditiData = new AaditiData(item);
      await newAaditiData.save();
      
      res.status(200).json({ message: 'Data assigned to aaditi  successfully' });
  } catch (error) {
      console.error('Error assigning data to aaditi', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to upload data and files
app.post('/upload', upload.array('files'), async (req, res) => {
    const {dateOfLogin,employeeIdOfCaseOwner, employeeName,adharCard,dateOfBirth, managerName,employementType,branchName,customerName,customerContact,mailId,customerPan,customerDateOfBirth,motherName,nominee,customerPermanentAddress,customerCurrentAdd,
        officeAddressWithPin,pinCode,state,city,customerOccupation,requiredLoanAmount,requiredLoanType,latestCIBILScore,bankingPassAndOtherDocPass,toBeLoggedInFromWhichLender,remarks,uniqueno} = req.body;
    const files = req.files.map(file => file.filename);

    const newData = new Data({
        dateOfLogin,
        employeeIdOfCaseOwner,
        adharCard,
        employeeName,
        dateOfBirth,
        managerName,
        employementType,
        branchName,
        customerName,
        customerContact,
        mailId,
        customerPan,
        customerDateOfBirth,
        motherName,
        nominee,
        customerPermanentAddress,
        customerCurrentAdd,
        officeAddressWithPin,
        pinCode,
        state,
        city,
        customerOccupation,
        requiredLoanType,
        requiredLoanAmount,
        latestCIBILScore,
        bankingPassAndOtherDocPass,
        toBeLoggedInFromWhichLender,
        remarks,
        uniqueno,
        files
    });

    try {
        await newData.save();
        console.log(newData);
        res.status(201).json({ message: 'Data and files uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading data and files' });
    }
});


// Route to upload Ops Team data
app.post('/upload-ops', async (req, res) => {
  const{pocName,customerPan,docCheckStatus,docCheckBy,tvrStatus,tvrDoneBy,eligibilityCheckStatus,eligibilityCheckBy,loginStatus,loginDoneBy,loginDate,leadId,caseStatus,kfs,lastUpdateDate,appovalDate,disbursalDate,opsRemarks,casePendingFrom,bankerName,bankerNo,bankerMail,cashBackAmount,finalApproval,finalDisbAmnt,highDegree,regYear,totalActiveLoanCountAmount,creditCardStatus,bounIn6Month,enquariesIn6Month,totalSal,totalExtraIncome,totalCalculatedSal,elgibilityType,creditSuggLender,creditRemarks,uniqueno} = req.body;
const opData = new OpsData({
  pocName,
  customerPan,
  docCheckStatus,
  docCheckBy,
  tvrStatus,
  tvrDoneBy,
  eligibilityCheckStatus,
  eligibilityCheckBy,
  loginStatus,
  loginDoneBy,
  loginDate,
  leadId,
  caseStatus,
  kfs,
  lastUpdateDate,
  appovalDate,
  disbursalDate,
  opsRemarks,
  casePendingFrom,
  bankerName,
  bankerNo,
  bankerMail,
  cashBackAmount,
  finalApproval,
  finalDisbAmnt,
  highDegree,
  regYear,
  totalActiveLoanCountAmount,
  creditCardStatus,
  bounIn6Month,
  enquariesIn6Month,
  totalSal,
  totalExtraIncome,
  totalCalculatedSal,
  elgibilityType,
  creditSuggLender,
  creditRemarks,
  uniqueno
});

  try {
    await opData.save();
    console.log(opData);
    res.status(201).json({ message: 'Ops Team data uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading Ops Team data' });
  }
});

app.post('/update-opsdata', async (req, res) => {
  try {
    const { _id, ...updatedOpsData } = req.body;

    const existingOpsData = await OpsData.findByIdAndUpdate(_id, updatedOpsData, { new: true });

    if (!existingOpsData) {
      return res.status(404).json({ error: 'Ops Team data not found' });
    }

    res.status(200).json({ message: 'Ops Team data updated successfully' });
  } catch (error) {
    console.error('Error updating Ops Team data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update data
app.post('/update-data', async (req, res) => {
  try {
    const { _id, ...updatedData } = req.body;
    const result = await Data.findByIdAndUpdate(_id, updatedData, { new: true });
    res.json(result);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Error updating data' });
  }
});


//Route to fetch data
app.get('/data', async (req, res) => {
    try {
        const data = await Data.find(); 
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

//Route to fetch ops data
app.get('/opsdata', async (req, res) => {
  try {
      const opsData = await OpsData.find(); 
      res.send(opsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});


// Route to fetch nisha data
app.get('/nishadata', async (req, res) => {
  try {
      const nishaData = await NishaData.find(); 
      res.send(nishaData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch nishaops data
app.get('/nishaopsdata', async (req, res) => {
  try {
      const nishaOpsData = await NishaOpsData.find(); 
      res.send(nishaOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch furkan data
app.get('/furkandata', async (req, res) => {
  try {
      const furkanData = await FurkanData.find(); 
      res.send(furkanData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch furkan ops data
app.get('/furkanopsdata', async (req, res) => {
  try {
      const furkanOpsData = await FurkanOpsData.find(); 
      res.send(furkanOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch anit data
app.get('/anitdata', async (req, res) => {
  try {
      const anitData = await AnitData.find(); 
      res.send(anitData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch anit ops data
app.get('/anitopsdata', async (req, res) => {
  try {
      const anitOpsData = await AnitOpsData.find(); 
      res.send(anitOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch anurandhan data
app.get('/anurandhandata', async (req, res) => {
  try {
      const anurandhanData = await AnurandhanData.find(); 
      res.send(anurandhanData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch anurandhan ops data
app.get('/anurandhanopsdata', async (req, res) => {
  try {
      const anurandhanOpsData = await AnurandhanOpsData.find(); 
      res.send(anurandhanOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});


// Route to fetch manoj data
app.get('/manojdata', async (req, res) => {
  try {
      const manojData = await ManojData.find(); 
      res.send(manojData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route to fetch manoj ops data
app.get('/manojopsdata', async (req, res) => {
  try {
      const manojOpsData = await ManojOpsData.find(); 
      res.send(manojOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});


// Route for fetch muskan data
app.get('/muskandata', async (req, res) => {
  try {
      const muskanData = await MuskanData.find(); 
      res.send(muskanData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route for fetch muskan ops data
app.get('/muskanopsdata', async (req, res) => {
  try {
      const muskanOpsData = await MuskanOpsData.find(); 
      res.send(muskanOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});


// Route for fetch aaditi data
app.get('/aaditidata', async (req, res) => {
  try {
      const aaditiData = await AaditiData.find(); 
      res.send(aaditiData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});

// Route for fetch muskan ops data
app.get('/aaditiopsdata', async (req, res) => {
  try {
      const aaditiOpsData = await AaditiOpsData.find(); 
      res.send(aaditiOpsData);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
  }
});



// Define your routes for deleting nishaData and nishaOpsData
app.delete('/nishadata/:id', async (req, res) => {
  try {
      await NishaData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting NishaData:', error);
      res.status(500).send('Error deleting NishaData');
  }
});

app.delete('/nishaopsdata/:id', async (req, res) => {
  try {
      await NishaOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting NishaOpsData:', error);
      res.status(500).send('Error deleting NishaOpsData');
  }
});


// Define your routes for deleting anit and anitOpsData
app.delete('/anitdata/:id', async (req, res) => {
  try {
      await AnitData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting AnitData:', error);
      res.status(500).send('Error deleting AnitData');
  }
});

app.delete('/anitOpsData/:id', async (req, res) => {
  try {
      await AnitOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting AnitData:', error);
      res.status(500).send('Error deleting AnitData');
  }
});


// Define your routes for deleting anurandhan and anurandhanOpsData
app.delete('/anurdata/:id', async (req, res) => {
  try {
      await AnurandhanData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting AnurandhanData:', error);
      res.status(500).send('Error deleting AnurandhanData');
  }
});

app.delete('/anuropsdata/:id', async (req, res) => {
  try {
      await AnurandhanOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting AnurandhanData:', error);
      res.status(500).send('Error deleting AnurandhanData');
  }
});


// Define your routes for deleting furkan and furkanOpsData
app.delete('/furkandata/:id', async (req, res) => {
  try {
      await FurkanData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting FurkanData:', error);
      res.status(500).send('Error deleting FurkanData');
  }
});

app.delete('/furkanopsdata/:id', async (req, res) => {
  try {
      await FurkanOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting FurkanData:', error);
      res.status(500).send('Error deleting FurkanData');
  }
});

// Define your routes for deleting Manojdata and manojopsdata
app.delete('/manojdata/:id', async (req, res) => {
  try {
      await ManojData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting ManojData:', error);
      res.status(500).send('Error deleting ManojData');
  }
});

app.delete('/manojopsdata/:id', async (req, res) => {
  try {
      await ManojOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting ManojData:', error);
      res.status(500).send('Error deleting ManojData');
  }
});

// Define your routes for deleting Muskan and muskanopsdata
app.delete('/muskandata/:id', async (req, res) => {
  try {
      await MuskanData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting MuskanData:', error);
      res.status(500).send('Error deleting MuskanData');
  }
});

app.delete('/muskanopsdata/:id', async (req, res) => {
  try {
      await MuskanOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting muskanopsData:', error);
      res.status(500).send('Error deleting muskanopsData');
  }
});


// Define your routes for deleting aaditi and aaditiopsdata
app.delete('/aaditidata/:id', async (req, res) => {
  try {
      await AaditiData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting Aaditi Data:', error);
      res.status(500).send('Error deleting Aaditi Data');
  }
});

app.delete('/aaditiopsdata/:id', async (req, res) => {
  try {
      await AaditiOpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting aaditiopsData:', error);
      res.status(500).send('Error deleting aaditiopsData');
  }
});

// delete for dataviwer page row
app.delete('/data/:id', async (req, res) => {
  try {
      await Data.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting Aaditi Data:', error);
      res.status(500).send('Error deleting Aaditi Data');
  }
});

app.delete('/opsdata/:id', async (req, res) => {
  try {
      await OpsData.findByIdAndDelete(req.params.id);
      res.status(204).send(); // 204 No Content - Successful deletion
  } catch (error) {
      console.error('Error deleting aaditiopsData:', error);
      res.status(500).send('Error deleting aaditiopsData');
  }
});


app.get('/download-zip', (req, res) => {
    const files = req.query.files.split(',');

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=download.zip`
    });

    const zip = archiver('zip', { zlib: { level: 9 } });

    zip.on('error', (err) => res.status(500).send({ error: 'Error creating zip file' }));

    zip.pipe(res);

    files.forEach((file) => {
        const filePath = path.join(__dirname, 'uploads', file);
        if (fs.existsSync(filePath)) {
            zip.file(filePath, { name: path.basename(file) });
        }
    });

    zip.finalize();
});

// Manually created user credentials
const userCredentials = {
  'SOURCER': { password: 'SouRcer@123' },
  'CHANNEL PARTNER': { password: 'cHanne1@123' },
  'INTERN' : { password: 'intern@123' },
  'F2-369-001': { password: 'H@rpRe3t#Singh' },
  'F2-369-002': { password: 'AbhiN@v@waL' },
  'F2-369-101': { password: 'Neh@_Singh_101' },
  'F2-369-173': { password: 'Anshika@Kh0li' },
  'F2-369-175': { password: 'R0sh@nY@d@v' },
  'F2-369-186': { password: 'A@nuR@Gg681' },
  'F2-369-188': { password: 'Jolly_Kumari123' },
  'F2-369-189': { password: 'Musk@n_J@iSw@l' },
  'F2-369-190': { password: 'AditiS1ngh@l' },
  'F2-369-191': { password: 'R@niKum@ri_123' },
  'F2-369-192': { password: 'Ambar_R@@j' },
  'F2-369-193': { password: 'Ad@rshTh@kur!23' },
  'F2-369-199': { password: 'AnkushSh@rm@123' },
  'F2-369-210': { password: 'M@nishaC@h@n!23' },
  'F2-369-224': { password: 'M@mtaK@noji@!23' },
  'F2-369-225': { password: 'Sur@jKum@r!23' },
  'F2-369-226': { password: 'S@g@rC@hu@n123' },
  'F2-369-003': { password: 'Sh@sh@nk_Sh@rm@!23' },
  'F2-369-004': { password: 'J!y@@7890' },
  'F2-369-005': { password: 'R@jkum@ri123' },
  'F2-369-006': { password: 'ShiV@niK@shy@P!23' },
  'F2-369-008': { password: 'M@noj_Kum@r_123' },
  'F2-369-009': { password: 'M@nishaS@xen@123' },
  'F2-369-010': { password: 'Ak@nsh@Bh@rti123' },
  'F2-369-018': { password: 'B@rkhaSingh_123' },
  'F2-369-019': { password: 'Furk@nJung123' },
  'F2-369-020': { password: 'Pr@g@tiS@xen@123' },
  'F2-369-021': { password: 'Uj@laRishiwal!23' },
  'F2-369-023': { password: 'J@iSingh123' },
  'F2-369-024': { password: 'Sh@rd@Kushw@h123' },
  'F2-369-025': { password: 'Krishn@Th@kur!23' },
  'F2-369-026': { password: 'NehaL@kr@_123' },
  'F2-369-045': { password: 'Him@nsh!Singh123' },
  'F2-369-056': { password: 'T@runDheem@n!23' },
  'F2-369-077': { password: 'Shubh@m_P@ht@k123' },
  'F2-369-079': { password: 'Anur@ndh@n_Kum@r!23' },
  'F2-369-083': { password: 'Pr@sh@nt_Kum@r123' },
  'F2-369-085': { password: 'Adity@_R@w@l123' },
  'F2-369-106': { password: 'Riy@_Ch@ddh@123' },
  'F2-369-107': { password: 'Vin@@t_Tiw@ri!23' },
  'F2-369-118': { password: 'Pr@deep_Kum@r123' },
  'F2-369-120': { password: 'M@nsi_Porw@l123' },
  'F2-369-122': { password: 'Neh@_D@nish_123' },
  'F2-369-130': { password: 'Roz!_Pr@veen123' },
  'F2-369-132': { password: 'L@khvind@r_Singh123' },
  'F2-369-133': { password: 'K@j@l_K@shy@p123' },
  'F2-369-135': { password: 'R@shi_G@ngw@r123' },
  'F2-369-136': { password: 'Krishn@_P@ndey123' },
  'F2-369-138': { password: 'Anit_Sinh@123' },
  'F2-369-145': { password: 'Prern@_Th@kur123' },
  'F2-369-148': { password: 'Adity@_Ch@uh@n123' },
  'F2-369-149': { password: 'Nish@_Ch@uh@n123' },
  'F2-369-150': { password: 'S@ni@_Irsh@d123' },
  'F2-369-152': { password: 'Abhish@k_Trivedi123' },
  'F2-369-155': { password: 'Renu_M@thur123' },
  'F2-369-157': { password: 'T@nnu_Y@d@v123' },
  'F2-369-159': { password: 'Shwet@_R@jput123' },
  'F2-369-166': { password: 'Him@nsh!Singh_1123' },
  'F2-369-167': { password: 'Ritu_Anur@gi123' },
  'F2-369-168': { password: 'Amir_Al@m_123' },
  'F2-369-172': { password: 'P@l@k_Mitt@l123' },
  'F2-369-183': { password: 'Anur@g_Sh@rm@123' },
  'F2-369-196': { password: 'Shiv@ngi_K@shy@p123' },
  'F2-369-197': { password: 'H@rsh_Ty@g!123' },
  'F2-369-200': { password: 'Noor_Ul_Hud@123' },
  'F2-369-201': { password: 'Tub@_Kh@n_123' },
  'F2-369-202': { password: 'A@di_Soni123' },
  'F2-369-205': { password: 'Ankit_P@l_123' },
  'F2-369-208': { password: 'Priy@nshu_P@l123' },
  'F2-369-209': { password: 'Shiv@m_Kum@r123' },
  'F2-369-215': { password: 'Ch@nch@l_Pr@j@p@ti123' },
  'F2-369-218': { password: 'Vish@l_123' },
  'F2-369-219': { password: 'Ritik@_Singh@l123' },
  'F2-369-220': { password: 'Rohit_C@hu@n123' },
  'F2-369-222': { password: 'Ir@m_Kh@n_123' },
  'F2-369-223': { password: 'M@nsiK@shy@p123' },
  'F2-369-228': { password: 'AkSh!tV!j@y@822' },
  'F2-369-229': { password: 'D@kSHs!nGh@92' },
  'F2-369-230': { password: 'D!V@ynShSi!nGh@L' },
  'F2-369-231': { password: 'h@rshBh@rDwa@j@231' },
  'F2-369-232': { password: 'suRy@P@rTapp@232' },
  'F2-369-233': { password: 'D!isH@233' },
  'F2-369-234': { password: 'S@m!rudh!N' },
  // for intern
  'INT-369-034': { password: 'Ankit@_Kundu123' },
  'INT-369-021': { password: 'Ayeshk@nt@_Moh@p@tr@123' },
  'INT-369-025': { password: 'Anur@gP@ss' },
  'INT-369-026': { password: 'AwN!sh@2023' },
  'INT-369-039': { password: 'Nah@r1234' },
  'INT-369-037': { password: 'Abdul_P@ss' },
  'INT-369-024': { password: 'J@shanPr33t#' },
  'INT-369-029': { password: 'Khu$h!B@j0ria' },
  'INT-369-036': { password: 'M@n!kR@n@2023' },
  'INT-369-028': { password: 'N@vr00pK@ur' },
  'INT-369-032': { password: 'Ach@ry@9876' },
  'INT-369-023': { password: 'R@hulS@h@2023' },
  'INT-369-022': { password: 'S!dd@rthL#2023' },
  'INT-369-030': { password: 'S1ddhi$!ngH@2023' },
  'INT-369-038': { password: 'Sn3h@l_P@ss' },
  'INT-369-027': { password: 'San@dp@$$w0rd' },
  'INT-369-035': { password: 'V1kr@nt_Chou!@rY2023' },
  // for sourcer
  'F3-369-003': { password: 'Sourav_#Pass123' },
  'F3-369-004': { password: 'Manas_$Pass456' },
  'F3-369-005': { password: 'ShrishtiTomar@_789' },
  'F3-369-006': { password: 'Muskan&Pass012' },
  'F3-369-007': { password: 'Pradeep*Pass345' },
  'F3-369-008': { password: 'Jyoti!Pass678' },
  'F3-369-009': { password: 'SonuPass_901' },
  'F3-369-010': { password: 'Neha#Pass234' },
  'F3-369-011': { password: 'ShamreenPass567!' },
  'F3-369-012': { password: 'Shazil_Pass890' },
  'F3-369-013': { password: 'PriyaSharma123#Pass' },
  'F3-369-014': { password: 'AmanPass$456' },
  'F3-369-015': { password: 'Shikha@_789Pass' },
  'F3-369-016': { password: 'SaloniPass012_' },
  'F3-369-017': { password: 'Abhishek345!Pass' },
  'F3-369-018': { password: 'KapilPass_678' },
  'F2369-019': { password: 'PriyaSharma901@Pass' }
};

// Manually created manager credentials
const managerCredentials = {
  
  'ABHINAV AWAL': { password: 'Abhin@v@1234' },
  'DEEPANSHU': { password: 'Deep@nshu@5678' },
  'F2-FINTECH': { password: 'F2F!ntech@9012' },
  'HARPREET SINGH': { password: 'H@rpreet@3456' },
  'JIYA': { password: 'J!y@@7890' },
  'NEHA LAKRA': { password: 'NeHaL@kra@123' },
  'PRASHANT KUMAR': { password: 'Prashant@456' },
  'PRADEEP KUMAR': { password: 'Pr@dEepKum@r@789' },
  'RAJKUMARI': { password: 'R@jkum@ri123' },
  'ROZI': { password: 'Roz!_Pr@veen123' },
  'SHASHANK SHARMA': { password: 'Sh@sHank@258' },
  'SHIVANI': { password: 'Sh!vAni@741' },
  'SHUBHAM': { password: 'SHubh@m@852' },
  'TARUN DHIMAN': { password: 'TarunDhiman@159' },
  'GROWTH MANAGER': { password: 'Gr0WtHm@n@Ger@99' },
  'SURAJ' : { password: 'Sur@J@9u'}
};

// Middleware function for user authentication
const authenticateUser = (req, res, next) => {
  const { employeeIdOfCaseOwner, password } = req.body;

  // Check if provided employee ID exists in user credentials
  if (!userCredentials[employeeIdOfCaseOwner]) {
    return res.status(401).json({ error: 'Invalid employee ID' });
  }

  // Check if provided username and password match
  if (userCredentials[employeeIdOfCaseOwner].password === password) {
    next(); // Proceed to the next middleware
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};

// API endpoint for user login
app.post('/api/login', authenticateUser, (req, res) => {
  res.json({ message: 'Login successful' });
});


app.get('/api/records/:employeeIdOfCaseOwner', async (req, res) => {
   const { employeeIdOfCaseOwner } = req.params;
 
   try {
     const recordsModel1 = await Data.find({ employeeIdOfCaseOwner });
     const uniqueCustomerPans = Array.from(new Set(recordsModel1.map(record => record.uniqueno)));
     const recordsModel2 = await OpsData.find({ uniqueno: { $in: uniqueCustomerPans } });
 
     const recordsModel1WithSource = recordsModel1.map(record => ({
       ...record.toObject(),
       source: 'Data',
       model: 'Model1'
     }));
 
     const recordsModel2WithSource = recordsModel2.map(record => ({
       ...record.toObject(),
       source: 'OpsData',
       model: 'Model2'
     }));
 
     const mergedRecords = [];
 
     recordsModel1WithSource.forEach(record1 => {
       const matchingRecord2 = recordsModel2WithSource.find(record2 => record2.uniqueno === record1.uniqueno);
       if (matchingRecord2) {
         mergedRecords.push({ ...record1, ...matchingRecord2 });
       }
     });
 
     res.json(mergedRecords);
   } catch (error) {
     console.error('Error fetching records:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
 });


 // Middleware function for manager authentication
const authenticateManager = (req, res, next) => {
  const { managerName, password } = req.body;
  
   // Check if provided employee ID exists in user credentials
   if (!managerCredentials[managerName]) {
     return res.status(401).json({ error: 'Invalid manager name' });
   }
 
   // Check if provided username and password match
   if (managerCredentials[managerName].password === password) {
     next(); // Proceed to the next middleware
   } else {
     return res.status(401).json({ error: 'Invalid credentials' });
   }
 };
 
 //API endpoint for manager login
 app.post('/api/manager/login', authenticateManager, (req, res) => {
   res.json({ message: 'Manager login successful' });
 });
 
//  // API endpoint for manager-based record retrieval
//  app.get('/api/records/manager/:managerName', async (req, res) => {
//    const { managerName } = req.params;
 
//    try {
//      const recordsModel1 = await Data.find({ managerName });
    
//      // console.log(recordsModel1); // Log recordsModel1 to see if it's retrieved correctly
//       const uniqueCustomerPans = Array.from(new Set(recordsModel1.map(record => record.uniqueno)));
//       const recordsModel2 = await OpsData.find({ uniqueno: { $in: uniqueCustomerPans } });
  
//       const recordsModel1WithSource = recordsModel1.map(record => ({
//         ...record.toObject(),
//         source: 'Data',
//         model: 'Model1'
//       }));
  
//       const recordsModel2WithSource = recordsModel2.map(record => ({
//         ...record.toObject(),
//         source: 'OpsData',
//         model: 'Model2'
//       }));
  
//       const mergedRecords = [];
  
//       recordsModel1WithSource.forEach(record1 => {
//         const matchingRecord2 = recordsModel2WithSource.find(record2 => record2.uniqueno === record1.uniqueno);
//         if (matchingRecord2) {
//           mergedRecords.push({ ...record1, ...matchingRecord2 });
//         }
//       });
  
//       res.json(mergedRecords);
//     } catch (error) {
//       console.error('Error fetching records:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//  });

// API endpoint for manager-based record retrieval
app.get('/api/records/manager/:managerName', async (req, res) => {
  const { managerName } = req.params;

  try {
    let recordsModel1;
    let uniqueCustomerPans;
    let recordsModel2;

    // Check if the requesting manager is SHASHANK SHARMA
    if (managerName === 'SHASHANK SHARMA') {
      // SHASHANK SHARMA can track SHASHANK SHARMA, JIYA, and SHIVANI managers
      recordsModel1 = await Data.find({ managerName: { $in: ['SHASHANK SHARMA', 'JIYA', 'SHIVANI'] } });
      uniqueCustomerPans = Array.from(new Set(recordsModel1.map(record => record.uniqueno)));
      recordsModel2 = await OpsData.find({ uniqueno: { $in: uniqueCustomerPans } });
    } else if (managerName === 'GROWTH MANAGER') {
      recordsModel1 = await Data.find({ managerName: { $in: ['GROWTH MANAGER', 'TARUN DHIMAN', 'RAJKUMARI', 'SHUBHAM', 'SURAJ KUMAR'] } });
     uniqueCustomerPans = Array.from(new Set(recordsModel1.map(record => record.uniqueno)));
     recordsModel2 = await OpsData.find({ uniqueno: { $in: uniqueCustomerPans } });
   } else {
      // Other managers can only track their own employee records
      recordsModel1 = await Data.find({ managerName });
      uniqueCustomerPans = Array.from(new Set(recordsModel1.map(record => record.uniqueno)));
      recordsModel2 = await OpsData.find({ uniqueno: { $in: uniqueCustomerPans } });
    }

    const recordsModel1WithSource = recordsModel1.map(record => ({
      ...record.toObject(),
      source: 'Data',
      model: 'Model1'
    }));

    const recordsModel2WithSource = recordsModel2.map(record => ({
      ...record.toObject(),
      source: 'OpsData',
      model: 'Model2'
    }));

    const mergedRecords = [];
    recordsModel1WithSource.forEach(record1 => {
      const matchingRecord2 = recordsModel2WithSource.find(record2 => record2.uniqueno === record1.uniqueno);
      if (matchingRecord2) {
        mergedRecords.push({ ...record1, ...matchingRecord2 });
      }
    });

    res.json(mergedRecords);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

