import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import AuthContext from '../utils/AuthProvider';
import ProfileContact from './profileComponents/ProfileContact';
import ProfilePersonal from './profileComponents/ProfilePersonal';
import ProfileExperience from './profileComponents/ProfileExperience';
import ProfileEducation from './profileComponents/ProfileEducation';
import ProfileCourse from './profileComponents/ProfileCourse';
import ProfileAbout from './profileComponents/ProfileAbout';
import ProfileLanguage from './profileComponents/ProfileLanguage';
import ProfileLink from './profileComponents/ProfileLink';
import ProfileSkill from './profileComponents/ProfileSkill';
import ProfilePreview from './profileComponents/ProfilePreview';

export interface ProfileData{
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  city: string;
  current_position: string;
}

export interface AboutData{
  about_me: string;
}

export interface ContactData{
  contact_email: string;
  phone_number: string;
}

export interface ExperienceData{
  position: string;
  localization: string;
  from_date: string;
  to_date: string;
  company: string;
  responsibilities: string;
  id: number;
}

export interface EducationData{
  id: number;
  school: string;
  educational_level: string;
  major: string;
  specialization: string;
  from_date: string;
  to_date: string;

}

export interface CourseData{
  id: number;
  course_name: string;
  organizer: string;
  certificate_link: string;
  finish_date: string;
}

export interface LanguageData{
  id: number;
  language: string;
  language_level: string;
}

export interface SkillData{
  id: number;
  skill: string;
}

export interface LinkData{
  id: number;
  link_name: string;
  link: string;
}
// for axios errors
export interface ErrorResponse{

    [key: string]: string[];
}
export interface MultipleErrorResponse {
  [key: string]: {
    [key: number]: {
      [key: string]: string[];
    };
  };
}

//UNIVERSAL GET SETSTATES
export type GetDataFunction = 
  React.Dispatch<React.SetStateAction<ProfileData | null>> |
  React.Dispatch<React.SetStateAction<ContactData | null>> |
  React.Dispatch<React.SetStateAction<ExperienceData | null>> |
  React.Dispatch<React.SetStateAction<ExperienceData[]>> |
  React.Dispatch<React.SetStateAction<EducationData | null>> |
  React.Dispatch<React.SetStateAction<EducationData[]>> |
  React.Dispatch<React.SetStateAction<CourseData[]>> |
  React.Dispatch<React.SetStateAction<CourseData | null>> |
  React.Dispatch<React.SetStateAction<LanguageData[]>> |
  React.Dispatch<React.SetStateAction<LanguageData | null>> |
  React.Dispatch<React.SetStateAction<LinkData[]>> |
  React.Dispatch<React.SetStateAction<LinkData | null>> |
  React.Dispatch<React.SetStateAction<SkillData[]>> |
  React.Dispatch<React.SetStateAction<SkillData | null>> |
  React.Dispatch<React.SetStateAction<AboutData | null>> |
  undefined;

//UNIVERSAL PUT STATES
export type EditDataFunction = 
  ProfileData | null |
  ContactData | null |
  ExperienceData | null |
  ExperienceData[] |
  EducationData | null |
  EducationData[] |
  CourseData | null |
  CourseData[] |
  LanguageData[] |
  LanguageData | null |
  LinkData[] |
  LinkData | null |
  SkillData[] |
  SkillData | null |
  AboutData | null |
  undefined;

export type EditMultipleDataFunction = 
  ExperienceData[] |
  EducationData[] |
  CourseData[] |
  LanguageData[] |
  LinkData[] |
  SkillData[] 
  ;

const initialMultipleErrors: MultipleErrorResponse = {
  profile: {},
  experience: {}
};

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [contact, setContact] = useState<ContactData| null>(null);
    const [experience, setExperience] = useState<ExperienceData[]>([]);
    const [education, setEducation] = useState<EducationData[]>([]);
    const [course, setCourse] = useState<CourseData[]>([]);
    const [language, setLanguage] = useState<LanguageData[]>([]);
    const [link, setLink] = useState<LinkData[]>([]);
    const [skill, setSkill] = useState<SkillData[]>([]);
    const [about, setAbout] = useState<AboutData | null>(null);

    const [singleCourse, setSingleCourse] = useState<CourseData | null>(null);
    const [singleExperience, setSingleExperience] = useState<ExperienceData | null>(null);
    const [singleEducation, setSingleEducation] = useState<EducationData | null>(null);
    const [singleLanguage, setSingleLanguage] = useState<LanguageData | null>(null);
    const [singleLink, setSingleLink] = useState<LinkData | null>(null);
    const [singleSkill, setSingleSkill] = useState<SkillData | null>(null);
    

    const { authTokens, logoutUser } = useContext(AuthContext);

    const [editPersonal, setEditPersonal] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [editExperience, setEditExperience] = useState(false);
    const [editMultipleExperiences, setEditMultipleExperiences] = useState<boolean[]>([]);
    const [editEducation, setEditEducation] = useState(false);
    const [editMultipleEducations, setEditMultipleEducations] = useState<boolean[]>([]);
    const [editCourse, setEditCourse] = useState(false);
    const [editMultipleCourses, setEditMultipleCourses] = useState<boolean[]>([]);
    const [editLanguage, setEditLanguage] = useState(false);
    const [editMultipleLanguages, setEditMultipleLanguages] = useState<boolean[]>([]);
    const [editLink, setEditLink] = useState(false);
    const [editMultipleLinks, setEditMultipleLinks] = useState<boolean[]>([]);
    const [editAbout, setEditAbout] = useState(false);
    const [editSkill, setEditSkill] = useState(false);
    
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)

    const renderFieldErrorMultiple = (
      field: string, 
      index: number, 
      errorKey: string, 
      error: MultipleErrorResponse | undefined) => {
      if (error && error[field] && typeof error[field][index] === "object" && 
      error[field][index].hasOwnProperty(errorKey)) {
        const messages = error[field][index][errorKey];
        return (
          <div>
            {messages.map((message, i) => (
              <span key={i} className="text-danger">
                {message}
              </span>
            ))}
          </div>
        );
      }
      return null;
    };

   
    //single getData
    const getData = async (
      setData: GetDataFunction,
      endpoint: string,
      id?: number,
    ) => {
      let path = `${endpoint}`
      if (id){  
        path = `${endpoint}/${id}`
      }
        try{
            const response = await axios.get(path, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            if (setData) {
                setData(response.data);
              }
            const data = response.data;
            // if (data.date_of_birth) {
            //     data.date_of_birth = new Date(data.date_of_birth);
            // }
            if(response.status === 200){
            }
        }catch(error: any){
            if (error.response && error.response.status === 401) {
                // Unauthorized - Logout the user
                logoutUser();
              } else {
                // Handle other errors here
                console.error('Error fetching profile:', error);
              }
        }
    }
//////////////////////////////////////////////////////////////
    const editData = async (
      state: EditDataFunction,
      editField: React.Dispatch<React.SetStateAction<boolean>>,
      endpoint: string,
      errorField: string,
      index: number = 0,

    ) =>{
      try{
          const response = await axios.put(`${endpoint}`, state,  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
          editField(false)
          removeMultipleErrors(`${errorField}`, index)
      }catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
          removeMultipleErrors(`${errorField}`, index)
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
          }
          console.log(error);
        }
  }

///////////////////////////////////////
    // EXPIRIENCE

    const sendMultipleData = async (
      state: EditDataFunction,
      editField: React.Dispatch<React.SetStateAction<boolean>>,
      setData: GetDataFunction,
      cleanState: (() => void) | null = null,
      endpoint: string,
      errorField: string,
      index: number = 0,
    ) =>{
        try{
            const response = await axios.post(`${endpoint}`, state,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              editField(false)

            removeMultipleErrors(`${errorField}`, index)
            getData(setData, `${endpoint}`);
            if (cleanState) cleanState()
        }catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          removeMultipleErrors(`${errorField}`, index)
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response?.data) {
              handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
            }
            console.log(error);
          }
    }


    const editMultipleData = async (
        state: EditMultipleDataFunction,
        editField: React.Dispatch<React.SetStateAction<boolean[]>>,
        setData: GetDataFunction,
        endpoint: string,
        errorField: string,
        index: number,
        id?: number
      ) =>{
        let path = `${endpoint}`
        if (id){  
          path = `${endpoint}/${id}`
        }
      try{
          const response = await axios.put(path, state[index],  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            
            editField((prevEdit) => {
              const newEdit = [...prevEdit];
              newEdit[index] = false;
              return newEdit;
              
            });
            getData(setData, `${endpoint}`);

            removeMultipleErrors(`${errorField}`, index)
      }catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
        removeMultipleErrors(`${errorField}`, index)
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
              const keys = Object.keys(axiosError.response?.data)
              keys.forEach((key) => {
                  const newKey = key + `_${index}`;
                  axiosError.response!.data[newKey] = axiosError.response!.data[key];
                  delete axiosError.response!.data[key];
              });
              console.log(axiosError.response?.data)
              handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
            // setErr(axiosError.response.data);
          }
          console.log(error);
        }
  }


    const deleteData = async (
        editField: React.Dispatch<React.SetStateAction<boolean[]>> | undefined,
        setData: GetDataFunction,
        endpoint: string,
        // errorField: string,
        id: number
      ) =>{
      // console.log(id)
      try{
          const response = await axios.delete(`${endpoint}/${id}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            if (editField){
            editField((prevEditExperiences) => {
              const newEditExperiences = [...prevEditExperiences];
              newEditExperiences[id] = false;
              return newEditExperiences;
            });
          }
            getData(setData, `${endpoint}`);

            // removeMultipleErrors('experience', index)
      }catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
          // removeMultipleErrors('experience', index)
          const axiosError = error as AxiosError<ErrorResponse>;
          // if (axiosError.response?.data) {
          //     const keys = Object.keys(axiosError.response?.data)
          //     keys.forEach((key) => {
          //         const newKey = key + `_${index}`;
          //         axiosError.response!.data[newKey] = axiosError.response!.data[key];
          //         delete axiosError.response!.data[key];
          //     });
          //     console.log(axiosError.response?.data)
          //     // handleMultipleErrors('experience', index, axiosError.response?.data)
          //   // setErr(axiosError.response.data);
          // }
          // console.log(error);
        }
  }


    const handleMultipleErrors = (key: string, index: number, errorData: ErrorResponse) => {
      setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
          ...(prevState[key] || {}),
          [index]: {
            ...(prevState[key]?.[index] || {}),
            ...errorData
          }
        }
      }));
    };

    const removeMultipleErrors = (key: string, index: number) => {
      setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
          ...(prevState[key] || {}),
          [index]: {}
        }
      }));
    };

    useEffect(() =>{
        getData(setProfile, '/profile/');
        getData(setContact, '/profile/contact');
        getData(setExperience, '/profile/experience');
        getData(setEducation, '/profile/education');
        getData(setCourse, '/profile/course');
        getData(setLanguage, '/profile/language');
        getData(setSkill, '/profile/skill');
        getData(setAbout, '/profile/about');
        getData(setLink, '/profile/link');
    }, [])
    return(
        <div className="container ">
            <ProfilePersonal 
                personal={profile}
                setPersonal={setProfile}
                editData={editData}
                getData={getData}
                setEditPersonal={setEditPersonal}
                editPersonal={editPersonal}
                multipleErrors={multipleErrors}                                             
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
            />
            <ProfileContact
                contact={contact}
                setContact={setContact}
                editData={editData}
                getData={getData}
                setEditContact={setEditContact}
                editContact={editContact}     
                multipleErrors={multipleErrors}                                             
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}

            />
            <ProfileExperience
                experience={experience}
                setExperience={setExperience}
                editExperience={editExperience}
                setEditExperience={setEditExperience}
                editMultipleData={editMultipleData}
                getData={getData}
                sendMultipleData={sendMultipleData}
                singleExperience={singleExperience}
                setSingleExperience={setSingleExperience}
                editMultipleExperiences={editMultipleExperiences}
                setEditMultipleExperiences={setEditMultipleExperiences}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteData={deleteData}
            />
            <ProfileEducation
                education={education}
                setEducation={setEducation}
                editEducation={editEducation}
                editMultipleData={editMultipleData}
                editMultipleEducations={editMultipleEducations}
                getData={getData}
                sendMultipleData={sendMultipleData}
                setEditMultipleEducations={setEditMultipleEducations}
                setSingleEducation={setSingleEducation}
                setEditEducation={setEditEducation}
                singleEducation={singleEducation}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteData={deleteData}
            />
                <ProfileCourse
                  course={course}
                  setCourse={setCourse}
                  editCourse={editCourse}
                  editMultipleData={editMultipleData}
                  editMultipleCourses={editMultipleCourses}
                  getData={getData}
                  sendMultipleData={sendMultipleData}
                  setEditMultipleCourses={setEditMultipleCourses}
                  setSingleCourse={setSingleCourse}
                  setEditCourse={setEditCourse}
                  singleCourse={singleCourse}
                  multipleErrors={multipleErrors}
                  removeMultipleErrors={removeMultipleErrors}
                  renderFieldErrorMultiple={renderFieldErrorMultiple}
                  deleteData={deleteData}
            />

                <ProfileLanguage
                  language={language}
                  setLanguage={setLanguage}
                  editLanguage={editLanguage}
                  editMultipleData={editMultipleData}
                  editMultipleLanguages={editMultipleLanguages}
                  getData={getData}
                  sendMultipleData={sendMultipleData}
                  setEditMultipleLanguages={setEditMultipleLanguages}
                  setSingleLanguage={setSingleLanguage}
                  setEditLanguage={setEditLanguage}
                  singleLanguage={singleLanguage}
                  multipleErrors={multipleErrors}
                  removeMultipleErrors={removeMultipleErrors}
                  renderFieldErrorMultiple={renderFieldErrorMultiple}
                  deleteData={deleteData}
            />
            <ProfileSkill
              skill={skill}
              setSkill={setSkill}
              editSkill={editSkill}
              editMultipleData={editMultipleData}
              getData={getData}
              sendMultipleData={sendMultipleData}
              setSingleSkill={setSingleSkill}
              setEditSkill={setEditSkill}
              singleSkill={singleSkill}
              multipleErrors={multipleErrors}
              removeMultipleErrors={removeMultipleErrors}
              renderFieldErrorMultiple={renderFieldErrorMultiple}
              deleteData={deleteData}
            />

            <ProfileAbout
              about={about}
              setAbout={setAbout}
              editData={editData}
              getData={getData}
              setEditAbout={setEditAbout}
              editAbout={editAbout}
              multipleErrors={multipleErrors}                                             
              removeMultipleErrors={removeMultipleErrors}
              renderFieldErrorMultiple={renderFieldErrorMultiple}
            />

            <ProfileLink
                link={link}
                setLink={setLink}
                editLink={editLink}
                editMultipleData={editMultipleData}
                editMultipleLinks={editMultipleLinks}
                getData={getData}
                sendMultipleData={sendMultipleData}
                setEditMultipleLinks={setEditMultipleLinks}
                setSingleLink={setSingleLink}
                setEditLink={setEditLink}
                singleLink={singleLink}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteData={deleteData}
            />
        </div>
    )
}
export default Profile