import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { count_new_messgaes_api_call } from '../Utils/ChatServiveApiUtils';
import { get_users_api_call } from '../Utils/UserServiceApiUtils';
import { get_messages_api_call } from '../Utils/ChatServiveApiUtils';
import { create_connection_to_stomp_server } from '../Utils/ChatServiveApiUtils';
import { send_message_to_stomp_server } from '../Utils/ChatServiveApiUtils';

const mockStore = configureStore([]);

jest.mock('../Utils/UserServiceApiUtils.js', () => ({
    get_users_api_call: jest.fn(),
}));

jest.mock('../Utils/ChatServiveApiUtils.js', () => ({
    __esModule: true,
    count_new_messgaes_api_call: jest.fn(),
    get_messages_api_call: jest.fn(),
    create_connection_to_stomp_server: jest.fn(),
    send_message_to_stomp_server: jest.fn(),
}));

describe('Chat', () => {
    let store;

    beforeEach(() => {

        get_users_api_call.mockReturnValue(
            new Promise((resolve, reject) => {
                const value = [{id: 1, username: "user1", email:"user1@mail.com" }, {id: 2, username: "user2", email:"user2@mail.com" }, {id: 3, username: "user3", email:"user3@mail.com" }];
                resolve(value);
            })
        );
        count_new_messgaes_api_call.mockReturnValue(
            new Promise((resolve, reject) => {
                const value = 2;
                resolve(value);
            })
        );
        get_messages_api_call.mockReturnValue(
            new Promise((resolve, reject) => {
                const value = [{senderId: 1, messageString: "hey hi!" }, {senderId: 2, messageString: "Hi, how are you!" }];
                resolve(value);
            })
        );
        send_message_to_stomp_server.mockReturnValue();
        create_connection_to_stomp_server.mockReturnValue();
    });

    it('App should show loginRegister component if user not loggerin', async () => {

        store = mockStore({
            UserServiceReducer: { isLoggedIn: false, userInfo: {id:-1, username:""}, jwt_web_token:"", logout_message: ""},
        });

        let component;
        await act(async () => { 
            // const { getByTestId, getByRole, queryAllByRole, debug, container } 
            component =
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            )}
        );

        const chatComponent = screen.queryByTestId('chat-component');
        expect(chatComponent).toEqual(null);

        const loginRegisterComponent = screen.queryByTestId('LoginRegister-component');
        expect(loginRegisterComponent).toBeInTheDocument();
    });


    it('App should show Chat component if user loggerin', async () => {

        store = mockStore({
            UserServiceReducer: { isLoggedIn: true, userInfo: {id:10, username:"test username 10"}, jwt_web_token:"test token", logout_message: ""},
        });

        let component;
        await act(async () => { 
            // const { getByTestId, getByRole, queryAllByRole, debug, container } 
            component =
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            )}
        );

        const chatComponent = screen.queryByTestId('chat-component');
        expect(chatComponent).toBeInTheDocument();

        const loginRegisterComponent = screen.queryByTestId('LoginRegister-component');
        expect(loginRegisterComponent).toEqual(null);
    });

});
