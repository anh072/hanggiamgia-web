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
import moment from 'moment';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../../components/Loading/Loading';
import config from '../../lib/config';
import { isWithinAWeek } from '../../lib/common';
import { restClient } from '../../client/index';
import MetaDecorator from '../../components/MetaDecorator/MetaDecorator';
import './PostVotes.css';


const StyledTableCell = withStyles({
  head: {
    backgroundColor: '#333338',
    color: 'white',
    lineHeight: '1.2rem',
    padding: '10px',
    fontSize: '0.9rem',
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  },
  body: {
    fontSize: 14,
    padding: '10px',
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  }
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
    maxWidth: '100%'
  },
  tableContainer: {
    maxWidth: '600px',
    '@media (max-width: 1024px)': {
      maxWidth: '60%'
    },
    '@media (max-width: 650px)': {
      maxWidth: '100%'
    }
  },
  addIcon: {
    fill: 'green',
    fontSize: '1rem',
    '@media (max-width: 650px)': {
      fontSize: '0.8rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  },
  removeIcon: {
    fill: 'red',
    fontSize: '1rem',
    '@media (max-width: 650px)': {
      fontSize: '0.8rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  },
  deleteIcon: {
    fontSize: '1rem',
    fill: 'red',
    marginLeft: '10px',
    '@media (max-width: 650px)': {
      fontSize: '0.8rem'
    },
    '@media (max-width: 450px)': {
      fontSize: '0.7rem'
    }
  }
});

function PostVotes() {

  const classes = useStyles();

  const { id } = useParams();

  const [ post, setPost ] = useState(null);
  const [ votes, setVotes ] = useState([]);
  const { user, getAccessTokenSilently } = useAuth0();
  const [ isLoadingVotes, setIsLoadingVotes ] = useState(false);
  const [ isLoadingPost, setIsLoadingPost ] = useState(false);
  const [ errors, setErrors ] = useState({});

  useEffect(() => {
    const getVotesByPostId = async (id) => {
      try {
        setIsLoadingVotes(true);
        const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
        const res = await restClient.get(
          `/posts/${id}/votes`,
          { 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            } 
          }
        );
        setVotes(res.data.votes);
        setIsLoadingVotes(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          votes: ''
        }));
      } catch (error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          votes: 'Lỗi: Không thể tải phiếu'
        }));
        setIsLoadingVotes(false);
      }
    };
    getVotesByPostId(id);
  }, [id, getAccessTokenSilently]);

  useEffect(() => {
    const getPostById = async (id) => {
      try {
        setIsLoadingPost(true);
        const res = await restClient.get(`/posts/${id}`);
        setPost(res.data);
        setIsLoadingPost(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          post: ''
        }));
      } catch (error) {
        console.log('error', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          post: 'Lỗi: Không thể tải bài viết'
        }));
        setIsLoadingPost(false);
      }
    };

    getPostById(id);
  }, [id]);

  const removeVote = async (voteId) => {
    try {
      const accessToken = await getAccessTokenSilently({ audience: config.auth0ApiAudience });
      await restClient.delete(
        `/posts/${id}/votes/${voteId}`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      const newVotes = votes.filter(vote => vote.id !== voteId);
      setVotes([...newVotes]);
    } catch(error) {
      console.log('error', error);
      alert('Lỗi: Không thể xóa phiếu');
    }
  };

  return (
    <div className="vote">
      {
        isLoadingPost && isLoadingVotes ? 
          <Loading size='large' /> :
          (
            <>
            {
              post && (<MetaDecorator title={`Giá Rẻ Việt Nam - Bình chọn`} description={`${post.title}`}/>)
            }
            {
              post && (<h2 className="vote__title">{post.title}</h2>)
            }
            {
              votes.length > 0 && (
                <TableContainer className={classes.tableContainer}>
                  <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align='left'>Người</StyledTableCell>
                        <StyledTableCell align="left">Phiếu</StyledTableCell>
                        <StyledTableCell align="left">Thời gian</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {votes.map((vote) => (
                        <StyledTableRow key={vote.voter}>
                          <StyledTableCell component="th" scope="row">
                            <Link to={{pathname: `/users/${vote.voter}`}}>{vote.voter}</Link>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <div className='vote__vote-container'>
                            {
                              vote.vote_type === 'increment' ? 
                                <AddIcon className={classes.addIcon} /> : 
                                <RemoveIcon className={classes.removeIcon} />
                            }
                            {
                              user[config.claimNamespace+'username'] === vote.voter && 
                                (<DeleteIcon className={classes.deleteIcon} onClick={() => removeVote(vote.id)} />)
                            }
                            </div>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {
                              isWithinAWeek(moment(vote.created_time)) ? 
                                moment(vote.created_time).fromNow() :
                                moment(vote.created_time).format("dddd, DD/MM/YYYY HH:mm:ss")
                            }
                          </StyledTableCell>
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
