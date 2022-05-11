import React, {useState, useEffect} from 'react';
import {Box, TextField, Typography, useTheme, List, ListItem, styled, Button,
  Checkbox as MuiCheckbox, FormControlLabel} from "@mui/material";
import {Filter, initialFilters} from '../../contexts/FilterContext';
import {CheckCircle, Menu, RadioButtonUnchecked} from '@mui/icons-material';
import useFilter from '../../hooks/useFilter';
import axios from 'axios';
import { Tag } from '../../models/contact';

const ListItemStriped = styled(ListItem)(({theme}) => `
  font-size: 13px;
  flex: 1;
  justify-content: space-between;
  &:nth-of-type(odd) {
    background: ${theme.palette.grey[200]};
  }
`);

const FilterTagList = styled(List)`
  padding: 0;
  border-radius: 10px;
  overflow-y: auto;
  max-height: 143px;
`;

const FilterItemLabel = styled(Typography)(({theme}) => ({
  marginBottom: theme.spacing(1),
}));

const FilterTextField = styled(TextField)`
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  background: #f3f3f3;
  border-radius: 10px;
`

const FilterItemBox = styled(Box)(({theme}) => ({
  marginBottom: theme.spacing(3)
}));

const FilterButton = styled(Button)(({theme}) => `
  background: #02a490;
  width: 100%;
  position: absolute;
  bottom: ${theme.spacing(4)};
  text-transform: capitalize;
`);

type Props = {};
export const Filters = (props: any) => {
  const theme = useTheme();
  const {setFilters} = useFilter();
  const [filterValue, setFilterValue] = useState<Filter>(initialFilters);
  const token: string | null = localStorage.getItem('token')
  const [includeTags, setIncludeTags] = useState<Array<string>>(['greetings', 'greetings1', 'greeting3']);
  const [excludeTags, setExcludeTags] = useState<Array<string>>(['greetings', 'greetings1', 'greeting3']);

  useEffect(() => {
    axios.get('https://api-im.chatdaddy.tech/tags', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }).then(res => res.data).then((data: any) => {
      const tags = data.tags?.map((t: any) => t.name);
      setIncludeTags([...tags])
      setExcludeTags([...tags]);
    })
  }, [token]);

  const Checkbox = (props: any) => {
    const fv = filterValue as any;
    return (
      <FormControlLabel
        label={props.label}
        control={
          <MuiCheckbox
            size="small"
            sx={{p: 0}}
            icon={props.icon}
            checkedIcon={props.checkedIcon}
            checked={fv[props.name as string]?.includes(props.it)}
          />
        }
      />
    );
  };

  const updateFilterState = (event: any, key: string) => {
    const value = event.target.value;
    setFilterValue({...filterValue, [key]: value || undefined});
  }

  const setTagsFilter = (type: 'include' | 'exclude', value: string) => {
    const prevFilterValue = filterValue;
    if (type === 'include') {
      if (!prevFilterValue.tags) {
        prevFilterValue.tags = [];
      }
      if (prevFilterValue.tags?.includes(value)) {
        prevFilterValue.tags?.splice(prevFilterValue.tags?.indexOf(value), 1);
      } else {
        prevFilterValue.tags?.push(value);
      }
    } else if (type === 'exclude') {
      if (!prevFilterValue.notTags) {
        prevFilterValue.notTags = [];
      }
      if (prevFilterValue.notTags?.includes(value)) {
        prevFilterValue.notTags?.splice(prevFilterValue.notTags?.indexOf(value), 1);
      } else {
        prevFilterValue.notTags?.push(value);
      }
    }

    setFilterValue({...prevFilterValue})
  }

  return (
    <Box sx={{position: 'fixed', minHeight: '100%', width: 250}}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Menu sx={{mr: 1}}/>
            <Typography variant="h6">Audience</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{color: theme.palette.grey[400], fontWeight: 500}}>
                {props.totalContacts}
            </Typography>
          </Box>
        </Box>

        <FilterItemBox>
          <FilterItemLabel variant="subtitle2">Include Tags:</FilterItemLabel>
          <FilterTagList>
            {includeTags.map(it => (
              <ListItemStriped key={it} onClick={() => setTagsFilter('include', it)}>
                {it}
                <Checkbox
                  label=""
                  icon={<RadioButtonUnchecked/>}
                  checkedIcon={<CheckCircle/>}
                  it={it}
                  name="tags"
                />
              </ListItemStriped>
            ))}
          </FilterTagList>
        </FilterItemBox>

        <FilterItemBox>
          <FilterItemLabel variant="subtitle2">Exclude Tags:</FilterItemLabel>
          <FilterTagList>
            {excludeTags.map(it => (
              <ListItemStriped key={it} onClick={() => setTagsFilter('exclude', it)}>
                {it}
                <Checkbox
                  label=""
                  icon={<RadioButtonUnchecked/>}
                  checkedIcon={<CheckCircle/>}
                  it={it}
                  name="notTags"
                />
              </ListItemStriped>
            ))}
          </FilterTagList>
        </FilterItemBox>

        <FilterItemBox>
          <FilterItemLabel variant="subtitle2">Message Sent:</FilterItemLabel>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <FilterTextField variant="outlined" size="small" sx={{mr: 1}} placeholder="Min"
                             onChange={(e) => updateFilterState(e, 'minMessagesSent')}/>
            <FilterTextField variant="outlined" size="small" placeholder="Max"
                             onChange={(e) => updateFilterState(e, 'maxMessagesSent')}/>
          </Box>
        </FilterItemBox>

        <FilterItemBox>
          <FilterItemLabel variant="subtitle2">Message Recieved:</FilterItemLabel>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <FilterTextField variant="outlined" size="small" sx={{mr: 1}} placeholder="Min"
                             onChange={(e) => updateFilterState(e, 'minMessagesRecv')}/>
            <FilterTextField variant="outlined" size="small" placeholder="Max"
                             onChange={(e) => updateFilterState(e, 'maxMessagesRecv')}/>
          </Box>
        </FilterItemBox>
      </Box>
      <Box>
        <FilterButton variant="contained" onClick={() => setFilters(filterValue)}>Save Filters</FilterButton>
      </Box>
    </Box>
  );
};