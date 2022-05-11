import React, { useEffect, useState, useCallback } from "react"
import InfiniteScroll from 'react-infinite-scroll-component';
import { Contact } from "../../models/contact"
import { SingleContact } from '../SingleContact'
import {
  Fab, Button, Box, styled, Input, Typography, FormControlLabel,
  Checkbox as MuiCheckbox, InputAdornment, CircularProgress
} from '@mui/material';
import { Add, CheckCircle, Search, RadioButtonUnchecked } from '@mui/icons-material';
import useFilter from '../../hooks/useFilter';
import { debounce } from 'lodash'
import axios from 'axios';

const ExportButton = styled(Button)(() => `
  background-color: #02a490;
  padding-right: 10px;
  padding-left: 10px;
  margin-right: 15px;
  text-transform: capitalize;
`);

type Props = {};
export const Contacts = (props: any) => {
  const apiUrlGetContacts: string = 'https://api-im.chatdaddy.tech/contacts';
  const token: string | null = localStorage.getItem('token')
  const [loader, setLoader] = useState(false);
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [nextPage, setNextPage] = useState<boolean>(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const { filters } = useFilter();

  const getContacts = useCallback((searchValue?: string) => {
    setLoader(true);
    axios.get(apiUrlGetContacts, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params: { ...filters, q: searchValue },
    })
      .then(res => res.data)
      .then(({ contacts, nextPage }: { contacts: Contact[], nextPage: string | null }) => {
        if (nextPage !== null) {
          setNextPage(true);
        } else {
          setNextPage(false);
        }
        setContacts(contacts)
        props.setTotalContacts(contacts.length)
        setLoader(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [filters, token]);

  useEffect(() => {
    getContacts();
  }, [filters])

  const doSearch = debounce(({ target: { value } }: { target: { value?: string } }) => {
    getContacts(value);
  }, 300);

  const Checkbox = (props: any) => {
    return (
      <FormControlLabel
        label={props.label}
        control={
          <MuiCheckbox
            size="small"
            sx={{ p: 0, ml: 2 }}
            checked={isSelectAll}
            icon={props.icon}
            checkedIcon={props.checkedIcon}
            onChange={(e) => {
              setIsSelectAll(e.target.checked)
            }}
          />
        }
      />
    );
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          m: 1,
        }}
      >
        <Typography variant="h6">All Contacts ({contacts.length})</Typography>
        <Box>
          <Fab size="small" sx={{ background: '#02a490', color: 'white' }}>
            <Add />
          </Fab>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 1,
          m: 1,
        }}
      >
        <Input
          onChange={doSearch}
          fullWidth
          disableUnderline
          size="medium"
          sx={{ borderRadius: 10, background: '#F2F5F9', p: 1 }}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          placeholder="Search contacts" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          ml: 1
        }}
      >

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Checkbox
            label=""
            icon={<RadioButtonUnchecked />}
            checkedIcon={<CheckCircle />}
          />
          <Typography variant="subtitle2">Select All</Typography>
        </Box>

        <ExportButton variant="contained" size="small">Export All</ExportButton>
      </Box>

      {
        loader ?
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box> :
          <InfiniteScroll
            dataLength={contacts.length}
            next={getContacts}
            hasMore={nextPage}
            loader={<CircularProgress />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>End of contacts</b>
              </p>
            }
          >
            {contacts.map((contact: Contact) => <SingleContact key={contact.id} contact={contact}
              isSelectAll={isSelectAll} />)}
          </InfiniteScroll>
      }
    </div>
  )
};
