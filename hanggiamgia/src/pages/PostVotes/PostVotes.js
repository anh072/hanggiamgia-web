import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../../components/Loading/Loading';
import config from '../../lib/config';
import './PostVotes.css';


const StyledTableCell = withStyles({
  head: {
    backgroundColor: '#333338',
    color: 'white',
  },
  body: {
    fontSize: 14,
  },
})(TableCell);

const StyledTableRow = withStyles({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#d5e0d8',
    },
  },
})(TableRow);

const useStyles = makeStyles({
  table: {
    maxWidth: '100%',
  },
  tableContainer: {
    maxWidth: '60%',
  },
  addIcon: {
    fill: 'green',
    fontSize: '1rem'
  },
  removeIcon: {
    fill: 'red',
    fontSize: '1rem'
  },
  deleteIcon: {
    fontSize: '1rem',
    fill: 'red',
    marginLeft: '10px'
  }
});

function PostVotes() {
  const apiBaseUrl = config.apiBaseUrl;
  const namespace = 'https://giare.vn/';

  const classes = useStyles();

  const { id } = useParams();

  const [ post, setPost ] = useState(null);
  const [ votes, setVotes ] = useState([]);
  const { user } = useAuth0();
  const [ isLoadingVotes, setIsLoadingVotes ] = useState(false);
  const [ isLoadingPost, setIsLoadingPost ] = useState(false);
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    const getVotesByPostId = async (id) => {
      try {
        setIsLoadingVotes(true);
        const res = await axios.get(
          `${apiBaseUrl}/posts/${id}/votes`,
          { 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'xxxx' //TODO: add access token here
            } 
          }
        );
        setVotes(res.data.votes);
        setIsLoadingVotes(false);
      } catch (error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          votes: 'Error: Unable to get votes'
        }));
        setIsLoadingVotes(false);
      }
    };
    getVotesByPostId(id);
  }, [id]);

  useEffect(() => {
    const getPostById = async (id) => {
      try {
        setIsLoadingPost(true);
        const res = await axios.get(`${apiBaseUrl}/posts/${id}`);
        setPost(res.data);
        setIsLoadingPost(false);
      } catch (error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          post: 'Error: Unable to get post'
        }));
        setIsLoadingPost(false);
      }
    };

    getPostById(id);
  }, [id]);

  const removeVote = async (voteId) => {
    try {
      await axios.delete(
        `${apiBaseUrl}/posts/${id}/votes/${voteId}`,
        { headers: { 'Authorization': 'Bearer ....', 'username': 'gmanshop' } } //TODO: remove this
      );
      const newVotes = votes.filter(vote => vote.id !== voteId);
      setVotes([...newVotes]);
    } catch(error) {
      console.log('error', error);
      alert('Error: Unable to revoke vote');
    }
  };

  return (
    <div className="vote">
      {
        isLoadingPost && isLoadingVotes ? 
          <Loading /> :
          (
            <>
            {
              post && (<h2 className="vote__title">{post.title}</h2>)
            }
            {
              votes.length > 0 && (
                <TableContainer className={classes.tableContainer}>
                  <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>User</StyledTableCell>
                        <StyledTableCell align="left">Vote</StyledTableCell>
                        <StyledTableCell align="left">Voted At</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {votes.map((vote) => (
                        <StyledTableRow key={vote.voter}>
                          <StyledTableCell component="th" scope="row">
                            <Link to={{pathname: `/users/${vote.voter}`}}>{vote.voter}</Link>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <>
                            {
                              vote.vote_type === 'increment' ? 
                                <AddIcon className={classes.addIcon} /> : 
                                <RemoveIcon className={classes.removeIcon} />
                            }
                            {
                              user[namespace+'username'] === vote.voter && 
                                (<DeleteIcon className={classes.deleteIcon} onClick={() => removeVote(vote.id)} />)
                            }
                            </>
                          </StyledTableCell>
                          <StyledTableCell align="left">{moment.tz(vote.created_time, 'Asia/Ho_Chi_Minh').format("ddd, MMM DD YYYY HH:MM:ss")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            }
            {
              errors.votes && (<p className='vote__error'>{errors.votes}</p>)
            }
            </>
          )
      }
    </div>
  )
}

export default PostVotes;
