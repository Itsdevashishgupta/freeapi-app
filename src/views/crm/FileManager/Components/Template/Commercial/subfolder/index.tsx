import React, { useEffect, useState } from 'react';
import {  getTemplateData } from '../../../data';
import {  TemplateDataItem } from '../../../type';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Dialog } from '@/components/ui';
import type { MouseEvent } from 'react';
import { FaFolder } from 'react-icons/fa';
import { StickyFooter } from '@/components/shared';
import YourFormComponent from '../../TemplateForm';
import Footer from '@/views/crm/FileManager/Footer';

const Index = () => {
  const [templateData, setTemplateData] = useState<TemplateDataItem[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const folderName = queryParams.get('folder');
  const type='commercial'
  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        const templateData = await getTemplateData();
        console.log(templateData);
        setTemplateData(templateData);
      } catch (error) {
        console.error('Error fetching lead data', error);
      }
    };

    fetchDataAndLog();
  }, []);
  console.log(templateData);
  
  const navigate = useNavigate();

  const [dialogIsOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = (e: MouseEvent) => {
    console.log('onDialogClose', e);
    setIsOpen(false);
  };

  return (
      <div>
          <div className=" mb-5 flex justify-between">
              <h3 className="">Folder</h3>
              <Button variant="solid" size="sm" onClick={() => openDialog()}>
                  Upload
              </Button>
          </div>
          {templateData.length>0 ? (
              <p>
                  <div className="grid xl:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-3">
                  {templateData.filter(item => item.files[0].folder_name ===type && item.files[0].sub_folder_name_first === folderName).map((item) => (
                      <div
                          key={item.files[0].folder_id}
                          className=" cursor-pointer"
                          onClick={() =>
                              navigate(
                                  `/app/crm/fileManager/project/templates/residential/subfolder/files?type=${type}&folder=${folderName}&subfolder=${item.files[0].sub_folder_name_second}&folder_id=${item.files[0].folder_id}`,
                              )
                          }
                      >
                          <div className='flex flex-col justify-center items-center gap-1'>
      <div className={` text-xl mr-3 text-yellow-500`}>
                                  <FaFolder />
                              </div>
     <p> {item.files[0].sub_folder_name_second}</p>
      </div>
                      </div>
                  ))}
              </div>
              </p>
          ) : (
             <p>No folders available. Click the button above to add folders.</p>
          )}
         <Footer/>
          <Dialog
              isOpen={dialogIsOpen}
              onClose={onDialogClose}
              onRequestClose={onDialogClose}
          >
              <YourFormComponent/>
          </Dialog>
      </div>
  )
};

export default Index;
