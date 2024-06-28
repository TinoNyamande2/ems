"use client"
import { useEffect, useState } from "react"
import { QueryResultRow } from "@vercel/postgres"
import { useQuery } from "react-query";
import { createProject, getAllProjects } from "@/data/projects";
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import AddTagModal from "../../../components/performancetracker/addProjectModal";
import { CircularProgressSpinner } from '../../../components/misc/CircularProgress';
import { ToastNotificationError, ToastNotificationSuccess } from '../../../components/misc/ToastNotification';
import { createTags, getAllTags } from "@/data/tags";

export const Tags = ({organisation}:{organisation:string}) => {

  const [tags, setTags] = useState<QueryResultRow[] | undefined>(undefined);
  const { data, error, isError, isLoading,refetch } = useQuery("all-tags", () => getAllTags(organisation));
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState('');
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false)
  const [errorSavingData, setErrorSavingData] = useState("")

  useEffect(() => {
    if (!isLoading) {
      setTags(data)
    }
  }, [data, isLoading])
  const addTag = async (tagname: string) => {
    try {
      await createTags(tagname,organisation);
      setOpen(true)
      refetch();
    } catch (error) {
      setErrorSavingData((error as Error).message)
      setErrorToastOpen(true)
    }
  }
  const handleClick = () => {
    setOpen(false);
    setErrorToastOpen(false)
  }
  return (
    <Container maxWidth="sm" style={{ padding: '20px' }}>
      <ToastNotificationSuccess message={"Tag Saved Successfully"} isOpen={open} handleClick={handleClick} duration={3000} />
      <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={9000} />
      <Typography variant="h4" component="h1" gutterBottom>
        Project Tags
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: '20px' }}
        onClick={() => setModalIsOpen(true)}
      >
        Add New Tag
      </Button>
      {isSaving ? (<div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
        <CircularProgressSpinner message='Saving' />
      </div>) : (
        <List>
          {tags?.map(tag => (
            <ListItem key={tag.id} style={{ paddingLeft: 0 }}>
              <ListItemText primary={tag.tagname} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )
    }
      < AddTagModal 
            isOpen={modalIsOpen}
           onRequestClose={() => setModalIsOpen(false)}
            onAddItem={addTag}
          />
    </Container>
  )
}