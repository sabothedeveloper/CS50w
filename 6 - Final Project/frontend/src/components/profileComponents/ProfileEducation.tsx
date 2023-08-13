import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { EducationData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';


interface ProfileEducationProps {
    education: EducationData[];
    singleEducation: EducationData | null;
    setSingleEducation: React.Dispatch<React.SetStateAction<EducationData | null>>;
    setEducation: React.Dispatch<React.SetStateAction<EducationData[]>>;
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
    setEditEducation: React.Dispatch<React.SetStateAction<boolean>>;
    editEducation: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleEducations: boolean[];
    setEditMultipleEducations: React.Dispatch<React.SetStateAction<boolean[]>>;
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

const ProfileEducation: React.FC<ProfileEducationProps> = ({
    education, setEducation, editEducation, getData,
    setEditEducation, editMultipleData, sendMultipleData,singleEducation, setSingleEducation,
    editMultipleEducations, setEditMultipleEducations, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    const editMultipleEducationsButton = async (index: number, id?: number) => {
        if (editMultipleEducations[index] === true){
           await cancelEditMultipleEducations(index, id)
           return
        }
        setEditMultipleEducations((prevEditEducations) => {
          const newEditEducations = [...prevEditEducations];
          newEditEducations[index] = !prevEditEducations[index];
          return newEditEducations;
        });
        
    }

    
    const cancelEditMultipleEducations = async (index: number, id?: number) => {
        setEditMultipleEducations((prevEditEducations) => {
          const newEditEducations = [...prevEditEducations];
          newEditEducations[index] = false;
          return newEditEducations;
        });
        removeMultipleErrors('education', index)
        await getData(setEducation, '/profile/education');

      };

    const editEducationButton = () =>{
        setEditEducation(!editEducation);
        if(editEducation === true){
            removeMultipleErrors('addeducation', 0)
            setSingleEducation(null)
            getData(setEducation, '/profile/education');
        }
        
    }
    const cancelEditEducation = async () =>{
        setEditEducation(false);
        removeMultipleErrors('addeducation', 0)
        // await getEducationData();
        setSingleEducation(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(education, setEditMultipleEducations, setEducation, 
            '/profile/education', 'education', index, id)
        // setEditPersonal(false);
    }

    const resetEducation = () => {
        setSingleEducation(null);
      };

    const saveEducation = () => {
        sendMultipleData(singleEducation, setEditEducation, setEducation, 
            resetEducation, '/profile/education', 'addeducation');
    }

    const deleteEducation = (id: number) => {
        deleteData(setEditMultipleEducations, setEducation, '/profile/education', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleEducation((prevEducation) => ({
        ...prevEducation!,
        [name]: value,
        }));
    
  
        
      };
    const handleEducationInputChange = (
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
    
        setEducation((prevEducation) => {
        const updatedEducations = [...prevEducation];
        updatedEducations[index] = {
            ...updatedEducations[index],
            ...updatedProperty, 
        };
        return updatedEducations;
        });
    };
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Education</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editEducationButton}>
                                Add education
                            </button>
                        </div>
                    </div>
                    {!education[0] && !editEducation &&
                    <div className='container'> 
                        <p className='text-secondary my-4'>
                        Your education is a powerful tool that can open doors to exciting possibilities. 
                        Here, you can showcase your academic journey, think of it as adding important 
                        pieces to your professional puzzle. By sharing your educational background, you're increasing your 
                        chances of discovering the perfect job fit.
                        </p>
                    </div>
                    
                    }
                    {editEducation && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`school`} className='form-label'>
                                    School Name:
                                </label>
                                <input
                                    type='text'
                                    name={`school`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `school`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleEducation?.school || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='School Name'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `school`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`educational_level`} className='form-label'>
                                    Educational Level:
                                </label>
                                <input
                                    type='text'
                                    name={`educational_level`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `educational_level`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleEducation?.educational_level || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Educational Level'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `educational_level`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`major`} className='form-label'>
                                    Major:
                                </label>
                                <input
                                    type='text'
                                    name={`major`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `major`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleEducation?.major || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Major'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `major`, multipleErrors)}
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
                                        className={`form-control${renderFieldErrorMultiple('addeducation', 0, `from_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleEducation?.from_date || ''}
                                        onChange={handleSingleInputChange}                     
                                    />
                                    {renderFieldErrorMultiple('addeducation', 0, `from_date`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor={`to_date`} className='form-label'>
                                        To:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`to_date`}
                                        className={`form-control${renderFieldErrorMultiple('addeducation', 0, `to_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleEducation?.to_date || ''}
                                        onChange={handleSingleInputChange}
                                    />
                                    {renderFieldErrorMultiple('addeducation', 0, `to_date`, multipleErrors)}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`specialization`} className='form-label'>
                                    Specialization:
                                </label>
                                <input
                                    type="text"
                                    name={`specialization`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `specialization`, multipleErrors) ? ' is-invalid' : ''}`}
                                    value={singleEducation?.specialization || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Specialization'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `specialization`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditEducation}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveEducation}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                {education.map((education, index) => (
                    <div key={index} className='text-center row'>
                        {index >= 1 && <hr className="border border-primary border-3 my-1"></hr>}
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => editMultipleEducationsButton(index, education.id)}>
                                <Icon path={mdiPencil} size={1} />
                            </button>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => deleteEducation(education.id)}>
                                Delete
                            </button>
                        </div>
                        {!editMultipleEducations[index] && (
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            <h2 className='mb-1 text-primary fs-1'>
                            {education?.school || ''} {education?.educational_level || ''}
                            </h2>
                            <p>{education?.major || ''}</p>
                            {education?.from_date && !education?.to_date && <p>From: {education?.from_date}</p>} 
                            {education?.from_date && education?.to_date && <p>From: {education?.from_date} to: {education?.to_date}</p>} 
                            {!education?.from_date && education?.to_date && <p>To: {education?.to_date}</p>}    
                            {/* <p>From: {education?.from_date || ''} to: {education?.to_date || ''}</p> */}
                            <p style={{ whiteSpace: 'pre-wrap' }}>{education?.specialization || ''}</p>
                            
                        </div>
                        
                        )}
                        
                        {editMultipleEducations[index] && (
                        <div className='container'>
                            <form>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`school_${index}`} className='form-label'>
                                        School Name:
                                    </label>
                                    <input
                                        type='text'
                                        name={`school_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `school_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.school || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='School Name'
                                    />
                                    {renderFieldErrorMultiple('education', index, `school_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`educational_level_${index}`} className='form-label'>
                                        Educational Level:
                                    </label>
                                    <input
                                        type='text'
                                        name={`educational_level_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `educational_level_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.educational_level || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='Educational Level'
                                    />
                                    {renderFieldErrorMultiple('education', index, `educational_level_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`major_${index}`} className='form-label'>
                                        Major:
                                    </label>
                                    <input
                                        type='text'
                                        name={`major_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `major_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.major || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='Major'
                                    />
                                    {renderFieldErrorMultiple('education', index, `major_${index}`, multipleErrors)}
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
                                        className={`form-control${renderFieldErrorMultiple('education', index, `from_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.from_date || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('education', index, `from_date_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`to_date_${index}`} className='form-label'>
                                        To:
                                    </label>
                                    <input
                                        type='month'
                                        name={`to_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `to_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.to_date || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('education', index, `to_date_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`specialization_${index}`} className='form-label'>
                                        Specialization:
                                    </label>
                                    <input
                                        type='text'
                                        name={`specialization_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `specialization_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.specialization || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='Specialization'
                                    />
                                    {renderFieldErrorMultiple('education', index, `specialization_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleEducations(index, education.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, education.id)}>
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
export default ProfileEducation