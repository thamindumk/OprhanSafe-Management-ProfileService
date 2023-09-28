import asyncHandler from "express-async-handler";
import {
  getChildProfilesAsync, getStaffProfileListAsync,getSocialWorkerProfileListAsync,getParentProfileListAsync,
  createChildProfileAsync,createStaffProfileAsync,createSocialWorkerProfileAsync,createParentProfileAsync,
  deleteChildProfileAsync, deleteStaffProfileAsync,deleteSocialWorkerProfileAsync,deleteParentProfileAsync,
  editChildProfileAsync, editStaffProfileAsync,editSocialWorkerProfileAsync,editParentProfileAsync,
  viewChildProfilesAsync,viewStaffProfileAsync,viewSocialWorkerProfileAsync, viewParentProfileAsync,
  viewChildInfoExternalAsync, getChildProfileCountAsync,getStaffCountAsync,getChildProfileCountAdminAsync,
  getStaffCountStaffAsync, getUserByEmailAsync,CreateProfileVersionAsync
} from "../services/profileService.js";
import {
  generatePassword,
} from "../utils/index.js";
import { notFound } from "../middleware/errorMiddleware.js";


// @desc notification broadcast
// route POST /api/notifications/broadcast
// @access Private

/**
 * get profile lists
 * 
 */
export const getChildProfileList = asyncHandler(async (req, res) => {
  const childProfiles = await getChildProfilesAsync();
  // Remove the timestamp from DateOfBirth
  const formattedChildProfiles = childProfiles.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    if (profile["DateOfAdmission"]) {
      const DateOfAdmissionTimestamp = new Date(profile["DateOfAdmission"]);
      const datePart = DateOfAdmissionTimestamp.toISOString().split("T")[0];
      profile["DateOfAdmission"] = datePart;
    }
    return profile;
  });

  return res.status(200).json({
    success: true,
    childProfiles: formattedChildProfiles,
    
  })
});

export const getStaffProfileList = asyncHandler(async(req,res)=>{
  const results = await getStaffProfileListAsync();
  return res.status(200).json({
    success:true,
    staffProfiles:results
  })
});

export const getSocialWorkerProfileList = asyncHandler(async(req,res)=>{
  const results = await getSocialWorkerProfileListAsync();
  return res.status(200).json({
    success:true,
    socialWorkerProfiles:results
  })
});

export const getParentProfileList = asyncHandler(async(req,res)=>{
  const results = await getParentProfileListAsync();
  return res.status(200).json({
    success:true,
    parentsProfiles:results
  })
});

/**
 * Create Profiles
 */

export const createChildProfile = asyncHandler(async(req,res)=>{
  const {
    FullName,
    DOB,
    Gender,
    DateOfAdmission,
    Country,
    City,
    Nationality,
    Language,
    Remark,
    MedicalDesc,
    BirthFather,
    BirthMother,
    ReasonForPlacement,
    RegisteredBy,
  } = req.body;
  await createChildProfileAsync(FullName,
    DOB,
    Gender,
    DateOfAdmission,
    Country,
    City,
    Nationality,
    Language,
    Remark,
    MedicalDesc,
    BirthFather,
    BirthMother,
    ReasonForPlacement,
    RegisteredBy,);
  return res.status(200).json({
    success:true,
    message: "successfully created a child profile",
   })
});

export const createStaffProfile = asyncHandler(async(req,res)=>{
  const {
    email,
    username,
    name,
    phoneNumber,
    password,
    orphanageId,
    address,
    nic,
    gender,
    dob,
  } = req.body;
  const results = await getUserByEmailAsync(email);

  if (results.length > 0) {
    res.status(400);
    throw new Error("Email Already Exists");
  } else {
    const hashedPassword = await generatePassword(password);
    const results = await createStaffProfileAsync({
      email,
      username,
      name,
      phoneNumber,
      hashedPassword,
      orphanageId,
      address,
      nic,
      gender,
      dob,
    });
    return res.status(201).json({
      success: true,
      userCreated: results[0],
    });
  }

});

export const createSocialWorkerProfile = asyncHandler(async(req,res)=>{
  const results = await createSocialWorkerProfileAsync();
  return res.status(200).json({
    success:true,
    socialWorkerProfile:results
  })
});

export const createParentProfile = asyncHandler(async(req,res)=>{
  const results = await createParentProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

/**
 * Delete Profiles
 */
export const deleteChildProfile = asyncHandler(async(req,res)=>{
  const {
    Id, commitMessage, committedByUserId
  } = req.body;
  const profileData = await viewChildProfiles(Id);
  await CreateProfileVersionAsync(Id,profileData, commitMessage, committedByUserId);
  await deleteChildProfileAsync(Id);
  return res.status(200).json({
    success:true,
    message: "successfully deleted child profile",
  })
});
export const deleteStaffProfile = asyncHandler(async(req,res)=>{
  const results = await deleteStaffProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});
export const deleteSocialWorkerProfile = asyncHandler(async(req,res)=>{
  const results = await deleteSocialWorkerProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});
export const deleteParentProfile = asyncHandler(async(req,res)=>{
  const results = await deleteParentProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});


/**
 * Edit profiles
 */
export const editChildProfile = asyncHandler(async(req,res)=>{
  const results = await editChildProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

export const editStaffProfile = asyncHandler(async(req,res)=>{
  const results = await editStaffProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

export const editSocialWorkerProfile = asyncHandler(async(req,res)=>{
  const results = await editSocialWorkerProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

export const editParentProfile = asyncHandler(async(req,res)=>{
  const results = await editParentProfileAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

/**
 * View profiles by managers
 */
export const viewChildProfiles = asyncHandler(async(req,res)=>{
  const results = await viewChildProfilesAsync(req.body.Id);
  // Remove the timestamp from DateOfBirth
  const formattedChildProfiles = results.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    if (profile["DateOfAdmission"]) {
      const DateOfAdmissionTimestamp = new Date(profile["DateOfAdmission"]);
      const datePart = DateOfAdmissionTimestamp.toISOString().split("T")[0];
      profile["DateOfAdmission"] = datePart;
    }
    return profile;
  });

  return res.status(200).json({
    success:true,
    childProfile:formattedChildProfiles
  })
});
export const viewStaffProfile = asyncHandler(async(req,res)=>{
  const results = await viewStaffProfileAsync(req.body.Id);
  const formattedStaffProfiles = results.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    return profile;
  });
  return res.status(200).json({
    success:true,
    parentProfile:formattedStaffProfiles
  })
});
export const viewSocialWorkerProfile = asyncHandler(async(req,res)=>{
  const results = await viewSocialWorkerProfileAsync(req.body.Id);
  const formattedSocialWorkerProfiles = results.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    return profile;
  });
  return res.status(200).json({
    success:true,
    parentProfile:formattedSocialWorkerProfiles
  })
});
export const viewParentProfile = asyncHandler(async(req,res)=>{
  const results = await viewParentProfileAsync();
  const formattedParentProfiles = results.map((profile) => {
    if (profile["DOBOfFather"]) {
      const DOBOfFatherTimestamp = new Date(profile["DOBOfFather"]);
      const datePart = DOBOfFatherTimestamp.toISOString().split("T")[0];
      profile["DOBOfFather"] = datePart;
    }
    if (profile["DOBOfMother"]) {
      const DOBOfMotherTimestamp = new Date(profile["DOBOfMother"]);
      const datePart = DOBOfMotherTimestamp.toISOString().split("T")[0];
      profile["DOBOfMother"] = datePart;
    }
    return profile;
  });
  return res.status(200).json({
    success:true,
    parentProfile:formattedParentProfiles
  })
});


/**
 * External party view child profiles
 */

export const viewChildInfoExternal = asyncHandler(async(req,res)=>{
  const results = await viewChildInfoExternalAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});


/**
 * Profile count
 */

export const getChildProfileCount = asyncHandler(async(req,res)=>{
  const results = await getChildProfileCountAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

export const getStaffCount = asyncHandler(async(req,res)=>{
  const results = await getStaffCountAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

export const getChildProfileCountAdmin = asyncHandler(async(req,res)=>{
  const results = await getChildProfileCountAdminAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});

export const getStaffCountStaff = asyncHandler(async(req,res)=>{
  const results = await getStaffCountStaffAsync();
  return res.status(200).json({
    success:true,
    parentProfile:results
  })
});