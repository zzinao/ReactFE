import React from 'react'
import { history } from '../../redux/configureStore'
import { useDispatch } from 'react-redux'
import { AuthInput, Grid, Button, Text, Image } from '../../element/index'
import styled from 'styled-components'
import { actionCreators as userActions } from '../../redux/modules/user'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { idVal, emailVal, nickVal, pwVal } from '../../shared/Validation'

function SignUp() {
  const dispatch = useDispatch()

  //formik의 formprops 역할을 해주는 데이터
  const formik = useFormik({
    initialValues: {
      id: '',
      email: '',
      nick: '',
      pw: '',
      pwCheck: '',
    },
    validationSchema: yup.object({
      id: idVal(),
      email: emailVal(),
      nick: nickVal(),
      pw: pwVal(),
      pwCheck: yup
        .string()
        .oneOf([yup.ref('pw'), null], '패스워드가 일치하지 않아요')
        .required('패스워드를 확인 해주세요!'),
    }),
    onSubmit: (values) => dispatch(userActions.signupDB(values)),
  })

  return (
    <>
      <Container>
        <Grid flex_column>
          <Text size="20px" bold>
            회원가입
          </Text>
          <Form onSubmit={formik.handleSubmit}>
            <AuthInput
              id="id"
              value={formik.values.id}
              autoComplete="off"
              _onChange={formik.handleChange}
              placeholder="아이디"
            />
            <Text>{formik.touched.id ? formik.errors.id : ''}</Text>
            <AuthInput
              id="email"
              autoComplete="off"
              value={formik.values.email}
              _onChange={formik.handleChange}
              placeholder="이메일"
            />
            <Text>{formik.touched.email ? formik.errors.email : ''}</Text>
            <AuthInput
              id="nick"
              autoComplete="off"
              value={formik.values.nick}
              _onChange={formik.handleChange}
              placeholder="닉네임"
            />
            <Text>{formik.touched.nick ? formik.errors.nick : ''}</Text>
            <AuthInput
              id="pw"
              value={formik.values.pw}
              autoComplete="off"
              type="password"
              _onChange={formik.handleChange}
              placeholder="비밀번호"
            />
            <Text>{formik.touched.pw ? formik.errors.pw : ''}</Text>
            <AuthInput
              id="pwCheck"
              value={formik.values.pwCheck}
              autoComplete="off"
              type="password"
              _onChange={formik.handleChange}
              placeholder="비밀번호 확인"
            />
            <Text>{formik.touched.pwCheck ? formik.errors.pwCheck : ''}</Text>
            <Grid isFlex>
              <Button
                type="submit"
                value="회원가입"
                variant="contained"
                purpleBtn
                margin="6px"
                width="150px"
              >
                회원가입
              </Button>
              <Button
                blackBtn
                width="150px"
                margin="8px"
                _onClick={() => {
                  history.push('/login')
                }}
              >
                {' '}
                취소
              </Button>
            </Grid>
          </Form>
        </Grid>
      </Container>
    </>
  )
}

const Container = styled.div`
  margin: 100px auto;
  width: 400px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`
export default SignUp
