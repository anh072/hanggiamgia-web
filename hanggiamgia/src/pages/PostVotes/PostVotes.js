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
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
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
      backgroundColor: '#fff',
    },
  },
})(TableRow);

const useStyles = makeStyles({
  table: {
    maxWidth: '70%',
  },
  tableContainer: {
    maxWidth: '70%',
  },
  addIcon: {
    fill: 'green',
    fontSize: '1rem'
  },
  removeIcon: {
    fill: 'red',
    fontSize: '1rem'
  }
});

function PostVotes() {
  const apiBaseUrl = config.apiBaseUrl;

  const classes = useStyles();

  const { id } = useParams();

  const [ post, setPost ] = useState(null);
  const [ votes, setVotes ] = useState([]);

  useEffect(() => {
    const getVotesByPostId = async (id) => {
      try {
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
      } catch (error) {
        console.log('error', error);
      }
    };

    const getPostById = async (id) => {
      try {
        const res = await axios.get(`${apiBaseUrl}/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.log('error', error);
      }
    };

    getPostById(id);
    getVotesByPostId(id);
  }, [id]);

  return (
    <div className="vote">
      {/* <Link to={{pathname: `/posts/${id}`}}>
        <h2 className="vote__title">{post.title}</h2>
      </Link> */}

      <TableContainer classes={classes.tableContainer}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell align="right">Vote</StyledTableCell>
              <StyledTableCell align="right">Voted At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {votes.map((vote) => (
              <StyledTableRow key={vote.voter}>
                <StyledTableCell component="th" scope="row">
                  {vote.voter}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {
                    vote.vote_type === 'increment' ? 
                      <AddIcon className={classes.addIcon} /> : 
                      <RemoveIcon className={classes.removeIcon} />
                  }
                </StyledTableCell>
                <StyledTableCell align="right">{moment.tz(vote.created_time, 'Asia/Ho_Chi_Minh').format("ddd, MMM DD YYYY HH:MM:ss")}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PostVotes;
