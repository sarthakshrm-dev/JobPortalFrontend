const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobseeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobseeker",
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  screeningQuestions: [
    {
      answer: String,
      question: String,
    },
  ],
  skills: [
    {
      skill: String,
      experience: String,
    },
  ],
  education: [
    {
      degree: String,
      yearOfPassing: String,
      institute: String,
    },
  ],
  isExperienced: Boolean,
  experience: [
    {
      organizationName: String,
      designation: String,
      responsibilities: String,
      relievingDate: String,
      joiningDate: String,
      isCurrentlyWorking: Boolean,
    },
  ],
  coverLetter: String,
  remarks: String,
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date },
});

module.exports = mongoose.model("Application", applicationSchema);
