import React, { useState } from 'react';
import { Avatar, Button, ClickAwayListener } from '@material-ui/core';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, emojiIndex } from 'emoji-mart';
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import { useMediaQuery } from 'react-responsive';
import './CommentInput.css';

const useStyles = makeStyles({
  avatar: {
    height: '35px',
    width: '35px',
    '@media (max-width: 450px)': {
      height: '30px',
      width: '30px'
    }
  },
  button: {
    marginTop: '10px',
    marginBottom: '10px',
    float: 'right'
  },
  emojiIcon: {
    fontSize: '1.4rem'
  }
});

const i81nEmojiPicker = {
  search: 'Tìm kiếm',
  clear: 'Xóa',
  notfound: 'Không tìm thấy cảm xúc',
  skintext: 'Chọn tông màu da mặc định',
  categories: {
    search: 'Kết quả tìm kiếm',
    recent: 'Thường xuyên sử dụng',
    smileys: 'Mặt cười và Cảm xúc',
    people: 'Con người và Cơ thể',
    nature: 'Động vật và Thiên nhiên',
    foods: 'Đồ ăn và Nước uống',
    activity: 'Hoạt động',
    places: 'Du lịch và Địa điểm',
    objects: 'Đồ vật',
    symbols: 'Biểu tượng',
    flags: 'Lá cờ',
    custom: 'Tự tạo',
  },
  categorieslabel: 'Danh mục cảm xúc',
  skintones: {
    1: 'Màu da mặc định',
    2: 'Màu da sáng',
    3: 'Màu da sáng trung bình',
    4: 'Màu da trung bình',
    5: 'Màu da trung bình tối',
    6: 'Màu da tối',
  }
};

function CommentInput({ onSubmit, onChange }) {
  const classes = useStyles();

  const [ text, setText ] = useState('');
  const [ showEmojiPicker, setShowEmojiPicker ] = useState(false);
  const isScreenSmall = useMediaQuery({ query: `(max-width: 450px)` });

  const handleChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit();
    setText('');
  };

  const toggleShowEmoji = (e) => {
    e.preventDefault();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    const newText = `${text}${emoji.native}`;
    setText(newText);
    onChange(newText);
  };

  const handleClickAway = () => {
    setShowEmojiPicker(false);
  };

  return (
    <div className='comment-input'>
      <Avatar className={classes.avatar} src="https://files.ozbargain.com.au/gmask/38.jpg" />
      <form>
        <ReactTextareaAutocomplete
          className="comment-input__textarea"
          value={text}
          loadingComponent={() => <span>Loading</span>}
          onChange={handleChange}
          placeholder="Viết bình luận..."
          trigger={{
            ':': {
              dataProvider: token =>
                emojiIndex.search(token).map(o => ({
                  colons: o.colons,
                  native: o.native,
                })),
              component: ({ entity: { native, colons } }) => (
                <div>{`${colons} ${native}`}</div>
              ),
              output: item => `${item.native}`,
            },
          }}
        />
        <div className='comment-input__buttons'>
          <button className='comment-input__emoji-button' onClick={toggleShowEmoji}>
            <InsertEmoticonIcon className={classes.emojiIcon}/>
          </button>
          <Button 
            className={classes.button}
            variant='contained' 
            size='small' color='primary' 
            onClick={handleSubmit}>
              Gửi
          </Button>
          { 
            showEmojiPicker && (
              <ClickAwayListener onClickAway={handleClickAway}>
                <Picker 
                  i18n={i81nEmojiPicker}
                  emojiTooltip
                  onSelect={handleEmojiSelect}
                  perLine={isScreenSmall ? 7 : 9}
                  showPreview={false}
                  showSkinTones={false}
                  emojiSize={isScreenSmall ? 18 : 24}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: '3rem',
                    left: '0',
                    fontSize: isScreenSmall ? '12px' : '16px'
                  }}
                />
              </ClickAwayListener>
            )
          }
        </div>
      </form>
    </div>
  );
}

CommentInput.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

export default CommentInput;
