import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { LanguageData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';

interface ProfileLanguageProps {
    language: LanguageData[];
    singleLanguage: LanguageData | null;
    setSingleLanguage: React.Dispatch<React.SetStateAction<LanguageData | null>>;
    setLanguage: React.Dispatch<React.SetStateAction<LanguageData[]>>;
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
    setEditLanguage: React.Dispatch<React.SetStateAction<boolean>>;
    editLanguage: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleLanguages: boolean[];
    setEditMultipleLanguages: React.Dispatch<React.SetStateAction<boolean[]>>;
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

const ProfileLanguage: React.FC<ProfileLanguageProps> = ({
    language, setLanguage, editLanguage, getData,
    setEditLanguage, editMultipleData, sendMultipleData,singleLanguage, setSingleLanguage,
    editMultipleLanguages, setEditMultipleLanguages, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    const editMultipleLanguagesButton = async (index: number, id?: number) => {
        if (editMultipleLanguages[index] === true){
           await cancelEditMultipleLanguages(index, id)
           return
        }
        setEditMultipleLanguages((prevEditLanguages) => {
          const newEditLanguages = [...prevEditLanguages];
          newEditLanguages[index] = !prevEditLanguages[index];
          return newEditLanguages;
        });
        
    }

    
    const cancelEditMultipleLanguages = async (index: number, id?: number) => {
        setEditMultipleLanguages((prevEditLanguages) => {
          const newEditLanguages = [...prevEditLanguages];
          newEditLanguages[index] = false;
          return newEditLanguages;
        });
        removeMultipleErrors('language', index)
        await getData(setLanguage, '/profile/language');

      };

    const editLanguageButton = () =>{
        setEditLanguage(!editLanguage);
        if(editLanguage === true){
            removeMultipleErrors('addlanguage', 0)
            setSingleLanguage(null)
            getData(setLanguage, '/profile/language');
        }
        
    }
    const cancelEditLanguage = async () =>{
        setEditLanguage(false);
        removeMultipleErrors('addlanguage', 0)
        // await getLanguageData();
        setSingleLanguage(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(language, setEditMultipleLanguages, setLanguage, 
            '/profile/language', 'language', index, id)
        // setEditPersonal(false);
    }

    const resetLanguage = () => {
        setSingleLanguage(null);
      };

    const saveLanguage = () => {
        sendMultipleData(singleLanguage, setEditLanguage, setLanguage, 
            resetLanguage, '/profile/language', 'addlanguage');
    }

    const deleteLanguage = (id: number) => {
        deleteData(setEditMultipleLanguages, setLanguage, '/profile/language', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleLanguage((prevLanguage) => ({
        ...prevLanguage!,
        [name]: value,
        }));
    
  
        
      };
    const handleLanguageInputChange = (
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
    
        setLanguage((prevLanguage) => {
        const updatedLanguages = [...prevLanguage];
        updatedLanguages[index] = {
            ...updatedLanguages[index],
            ...updatedProperty, 
        };
        return updatedLanguages;
        });
    };
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Languages</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editLanguageButton}>
                                Add
                            </button>
                        </div>
                    </div>
                    {!language[0] && !editLanguage &&
                    <div className='container'> 
                        <p className='text-secondary my-4'>
                        Your language skills show you can 
                        connect and collaborate across different cultures, which is a big plus for potential employers.
                        </p>
                    </div>
                    
                    }
                    {editLanguage && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`language`} className='form-label'>
                                    Language:
                                </label>
                                <input
                                    type='text'
                                    name={`language`}
                                    className={`form-control${renderFieldErrorMultiple('addlanguage', 0, `language`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleLanguage?.language || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Language'
                                />
                                {renderFieldErrorMultiple('addlanguage', 0, `language`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`language_level`} className='form-label'>
                                    Level:
                                </label>
                                <input
                                    type='text'
                                    name={`language_level`}
                                    className={`form-control${renderFieldErrorMultiple('addlanguage', 0, `language_level`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleLanguage?.language_level || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Language Level'
                                />
                                {renderFieldErrorMultiple('addlanguage', 0, `language_level`, multipleErrors)}
                                </div>
 
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditLanguage}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveLanguage}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                {language.map((language, index) => (
                    <div key={index} className='text-center row'>
                        {index >= 1 && <hr className="border border-primary border-3 my-1"></hr>}
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => editMultipleLanguagesButton(index, language.id)}>
                                <Icon path={mdiPencil} size={1} />
                            </button>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={() => deleteLanguage(language.id)}>
                                Delete
                            </button>
                        </div>
                        {!editMultipleLanguages[index] && (
                        <div className='col-auto col-md-8 col-sm-6 text-start'>

                            <p>{language?.language || ''}</p>
                            <p>{language?.language_level || ''}</p>

                        </div>
                        
                        )}
                        
                        {editMultipleLanguages[index] && (
                        <div className='container'>
                            <form>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`language_${index}`} className='form-label'>
                                        Name:
                                    </label>
                                    <input
                                        type='text'
                                        name={`language_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('language', index, `language_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={language?.language || ''}
                                        onChange={(e) => handleLanguageInputChange(index, e)}
                                        placeholder='Language'
                                    />
                                    {renderFieldErrorMultiple('language', index, `language_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                    <label htmlFor={`language_level_${index}`} className='form-label'>
                                       Language:
                                    </label>
                                    <input
                                        type='text'
                                        name={`language_level_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('language', index, `language_level_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={language?.language_level || ''}
                                        onChange={(e) => handleLanguageInputChange(index, e)}
                                        placeholder='Language Level'
                                    />
                                    {renderFieldErrorMultiple('language', index, `language_level_${index}`, multipleErrors)}
                                    </div>
                                </div>

                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleLanguages(index, language.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, language.id)}>
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
export default ProfileLanguage