import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import moment from 'moment';
import config from '../../lib/config';
import Tab from '../../components/Tab/Tab';
import './UserProfile.css';
import TabItem from "../../components/Tab/TabItem";
import SimplePostItem from "../../components/SimplePostItem/SimplePostItem";
import Loading from "../../components/Loading/Loading";


function UserProfile() {
  const apiBaseUrl = config.apiBaseUrl;

  const { user } = useAuth0();
  const userInfo = [
    { label: 'Username', value: user[config.claimNamespace+'username'] },
    { label: 'Email', value: user.email },
    { label: 'Member since', value: moment.tz(user[config.claimNamespace+'created_time'], config.localTimezone).format('YYYY/MM/DD') }
  ];

  const [ selectedTab, setSelectedTab ] = useState('Posts');
  const [ posts, setPosts ] = useState({});
  const [ errors, setErrors ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    const getPostsByUsername = async (username) => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiBaseUrl}/users/${username}/posts`);
        setPosts(res.data);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: ''
        }));
        setIsLoading(false);
      } catch(error) {
        console.error('error', error);
        setIsLoading(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          posts: 'Error: Unable to get posts'
        }));
      }
    };

    const getCommentedPostsByUsername = async (username) => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiBaseUrl}/users/${username}/commented_posts`);
        setPosts(res.data);
        setErrors(prevErrors => ({
          ...prevErrors,
          comments: ''
        }));
        setIsLoading(false);
      } catch(error) {
        console.error('error', error);
        setIsLoading(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          comments: 'Error: Unable to get posts commented by the user'
        }));
      }
    };

    if (selectedTab === 'Posts') getPostsByUsername(user[config.claimNamespace+'username']);
    else getCommentedPostsByUsername(user[config.claimNamespace+'username']);
  }, [selectedTab])

  const handleSelectTab = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className='profile'>
      <h2>User Profile</h2>
      <div className='profile__details'>
        <div className='profile__avatar-container'>
          <img className='profile__avatar' src={user.picture} alt={`${user.username} avatar`} />
        </div>
        <table className='profile__userinfo'>
          <tbody>
            {
              userInfo.map(info => 
                (<tr>
                  <td align='left' className='profile__label'>{info.label}</td>
                  <td align='left'>{info.value}</td>
                </tr>))
            }
          </tbody>
        </table>
      </div>
      <Tab value={selectedTab} onChange={handleSelectTab}>
        <TabItem value="Posts" label="Posts" />
        <TabItem value="Comments" label="Commented On" />
      </Tab>
      <div className='profile__items'>
        {isLoading ?
          <Loading size='medium' /> : (
            <>
            {
              posts.posts && posts.posts.length > 0 && (
                posts.posts.map(post => <SimplePostItem post={post} key={post.id} />)
              )
            }
            { errors.posts && (<p className='profile__error'>{errors.posts}</p>) }
            { errors.comments && (<p className='profile__error'>{errors.comments}</p>) }
            </>
          )
        }

      </div>
    </div>
  );
};

export default UserProfile;