import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ExperienceData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';


interface ProfileExperienceProps {
    experience: ExperienceData[];
    singleExperience: ExperienceData | null;
    setSingleExperience: React.Dispatch<React.SetStateAction<ExperienceData | null>>;
    setExperience: React.Dispatch<React.SetStateAction<ExperienceData[]>>;
    editMultipleData: (
        state: EditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: GetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
        ) => Promise<void>
    getData: (
        setData: GetDataFunction,
        endpoint: string,
        id?: number | undefined
        ) => void;
    setEditExperience: React.Dispatch<React.SetStateAction<boolean>>;
    editExperience: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleExperiences: boolean[];
    setEditMultipleExperiences: React.Dispatch<React.SetStateAction<boolean[]>>;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    deleteData: (
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: GetDataFunction, 
        endpoint: string, 
        id: number
        ) => Promise<void>;
}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({
    experience, setExperience, editExperience, getData,
    setEditExperience, editMultipleData, sendMultipleData,singleExperience, setSingleExperience,
    editMultipleExperiences, setEditMultipleExperiences, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    

    const editMultipleExperiencesButton = async (index: number, id?: number) => {
        if (editMultipleExperiences[index] === true){
           await cancelEditMultipleExperiences(index, id)
           return
        }
        setEditMultipleExperiences((prevEditExperiences) => {
          const newEditExperiences = [...prevEditExperiences];
          newEditExperiences[index] = !prevEditExperiences[index];
          return newEditExperiences;
        });
        
    }

    
    const cancelEditMultipleExperiences = async (index: number, id?: number) => {
        setEditMultipleExperiences((prevEditExperiences) => {
          const newEditExperiences = [...prevEditExperiences];
          newEditExperiences[index] = false;
          return newEditExperiences;
        });
        removeMultipleErrors('experience', index)
        await getData(setExperience, '/profile/experience');

      };

    const editExperienceButton = () =>{
        setEditExperience(!editExperience);
        if(editExperience === true){
            removeMultipleErrors('addexperience', 0)
            setSingleExperience(null)
            getData(setExperience, '/profile/experience');
        }
        
    }
    const cancelEditExperience = async () =>{
        setEditExperience(false);
        removeMultipleErrors('addexperience', 0)
        // await getExperienceData();
        setSingleExperience(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(experience, setEditMultipleExperiences, setExperience, 
            '/profile/experience', 'experience', index, id)
        // setEditPersonal(false);
    }

    const resetExperience = () => {
        setSingleExperience(null);
      };

    const saveExperience = () => {
        sendMultipleData(singleExperience, setEditExperience, setExperience, 
            resetExperience, '/profile/experience', 'addexperience');
    }

    const deleteExperience = (id: number) => {
        deleteData(setEditMultipleExperiences, setExperience, '/profile/experience', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;

        setSingleExperience((prevExperience) => ({
        ...prevExperience!,
        [name]: value,
        }));
        
      };
    const handleExperienceInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        
    ) => {
        let { name, value } = event.target;
        name = name.substring(0, name.lastIndexOf('_'));
        // console.log(value)
        // Create an object with the new property and value
        const updatedProperty = {
        [name]: value,
        };
    
        setExperience((prevExperience) => {
        const updatedExperiences = [...prevExperience];
        // console.log(updatedExperiences)
        // console.log(...prevExperience)
        // console.log(updatedExperiences[index])
        // console.log(updatedProperty)
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            ...updatedProperty, // Spread the new property and value into the existing object
        };
        // console.log(typeof(updatedExperiences))
        return updatedExperiences; // Return the updated state
        });
    };
    //   console.log(typeof(experience))
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Work Experience</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editExperienceButton}>
                                Add experience
                            </button>
                        </div>
                    </div>
                    {!experience[0] && !editExperience &&
                    <div className='container'> 
                        <p className='text-secondary my-4'>
                        This is your chance to shine! Tell us about your work experience! The more you share here, the better 
                        your chances of finding a job that's just right for you. Think of it as painting a picture 
                        of your career journey to help employers see how awesome you are.
                        </p>
                    </div>
                    
                    }
                    {editExperience && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`position`} className='form-label'>
                                    Position:
                                </label>
                                <input
                                    type='text'
                                    name={`position`}
                                    className={`form-control${renderFieldErrorMultiple('addexperience', 0, `position`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleExperience?.position || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Position'
                                />
                                {renderFieldErrorMultiple('addexperience', 0, `position`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`localization`} className='form-label'>
                                    Localization:
                                </label>
                                <input
                                    type='text'
                                    name={`localization`}
                                    className={`form-control${renderFieldErrorMultiple('addexperience', 0, `localization`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleExperience?.localization || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Localization'
                                />
                                {renderFieldErrorMultiple('addexperience', 0, `localization`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`company`} className='form-label'>
                                    Company:
                                </label>
                                <input
                                    type='text'
                                    name={`company`}
                                    className={`form-control${renderFieldErrorMultiple('addexperience', 0, `company`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleExperience?.company || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Company'
                                />
                                {renderFieldErrorMultiple('addexperience', 0, `company`, multipleErrors)}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor={`from_date`} className='form-label'>
                                        From:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`from_date`}
                                        className={`form-control${renderFieldErrorMultiple('addexperience', 0, `from_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleExperience?.from_date || ''}
                                        onChange={handleSingleInputChange}
                                                             
                                    />
                                    {renderFieldErrorMultiple('addexperience', 0, `from_date`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor={`to_date`} className='form-label'>
                                        To:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`to_date`}
                                        className={`form-control${renderFieldErrorMultiple('addexperience', 0, `to_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleExperience?.to_date || ''}
                                        onChange={handleSingleInputChange}
                                    />
                                    {renderFieldErrorMultiple('addexperience', 0, `to_date`, multipleErrors)}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`responsibilities`} className='form-label'>
                                    Responsibilities:
                                </label>
                                <textarea
                                    name={`responsibilities`}
                                    className={`form-control${renderFieldErrorMultiple('addexperience', 0, `responsibilities`, multipleErrors) ? ' is-invalid' : ''}`}
                                    value={singleExperience?.responsibilities || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Responsibilities'
                                />
                                {renderFieldErrorMultiple('addexperience', 0, `responsibilities`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditExperience}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveExperience}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                {experience.map((experience, index) => (
                    <div key={index} className='text-center row'>
                        {index >= 1 && <hr className="border border-primary border-3 my-1"></hr>}
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => editMultipleExperiencesButton(index, experience.id)}>
                                <Icon path={mdiPencil} size={1} />
                            </button>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => deleteExperience(experience.id)}>
                                Delete
                            </button>
                        </div>
                        {!editMultipleExperiences[index] && (
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            <h2 className='mb-1 text-primary fs-1'>
                            {experience?.position || ''} {experience?.localization || ''}
                            </h2>
                            <p>{experience?.company || ''}</p>
                            {experience?.from_date && !experience?.to_date && <p>From: {experience?.from_date}</p>} 
                            {experience?.from_date && experience?.to_date && <p>From: {experience?.from_date} to: {experience?.to_date}</p>} 
                            {!experience?.from_date && experience?.to_date && <p>To: {experience?.to_date}</p>}    
                            {/* <p>From: {experience?.from_date || ''} to: {experience?.to_date || ''}</p> */}
                            <p style={{ whiteSpace: 'pre-wrap' }}>{experience?.responsibilities || ''}</p>
                            
                        </div>
                        
                        )}
                        
                        {editMultipleExperiences[index] && (
                        <div className='container'>
                            <form>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`position_${index}`} className='form-label'>
                                        Position:
                                    </label>
                                    <input
                                        type='text'
                                        name={`position_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('experience', index, `position_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={experience?.position || ''}
                                        onChange={(e) => handleExperienceInputChange(index, e)}
                                        placeholder='Position'
                                    />
                                    {renderFieldErrorMultiple('experience', index, `position_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`localization_${index}`} className='form-label'>
                                        Localization:
                                    </label>
                                    <input
                                        type='text'
                                        name={`localization_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('experience', index, `localization_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={experience?.localization || ''}
                                        onChange={(e) => handleExperienceInputChange(index, e)}
                                        placeholder='Localization'
                                    />
                                    {renderFieldErrorMultiple('experience', index, `localization_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`company_${index}`} className='form-label'>
                                        Company:
                                    </label>
                                    <input
                                        type='text'
                                        name={`company_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('experience', index, `company_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={experience?.company || ''}
                                        onChange={(e) => handleExperienceInputChange(index, e)}
                                        placeholder='Company'
                                    />
                                    {renderFieldErrorMultiple('experience', index, `company_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`from_date_${index}`} className='form-label'>
                                        From:
                                    </label>
                                    <input
                                        type='month'
                                        name={`from_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('experience', index, `from_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={experience?.from_date || ''}
                                        onChange={(e) => handleExperienceInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('experience', index, `from_date_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`to_date_${index}`} className='form-label'>
                                        To:
                                    </label>
                                    <input
                                        type='month'
                                        name={`to_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('experience', index, `to_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={experience?.to_date || ''}
                                        onChange={(e) => handleExperienceInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('experience', index, `to_date_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`responsibilities_${index}`} className='form-label'>
                                        Responsibilities:
                                    </label>
                                    <textarea
                                        name={`responsibilities_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('experience', index, `responsibilities_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={experience?.responsibilities || ''}
                                        onChange={(e) => handleExperienceInputChange(index, e)}
                                        placeholder='Responsibilities'
                                    />
                                    {renderFieldErrorMultiple('experience', index, `responsibilities_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleExperiences(index, experience.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, experience.id)}>
                                Save
                            </button>
                            </div>
                            
                        </div>
                        
                        )}
                        
                    </div>
                    ))}
            </div>
        </div>
        </div>
    )
}

export default ProfileExperience