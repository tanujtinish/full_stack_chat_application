import React from 'react';
import { render, screen, fireEvent, act, getByTestId } from '@testing-library/react';
import Chat from '../Chat';
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { Routes, Route } from "react-router-dom";
import { count_new_messgaes_api_call } from '../../Utils/ChatServiveApiUtils';
import { get_users_api_call } from '../../Utils/UserServiceApiUtils';
import { get_messages_api_call } from '../../Utils/ChatServiveApiUtils';
import { create_connection_to_stomp_server } from '../../Utils/ChatServiveApiUtils';
import { send_message_to_stomp_server } from '../../Utils/ChatServiveApiUtils';

const mockStore = configureStore([]);

jest.mock('../../Utils/UserServiceApiUtils.js', () => ({
    get_users_api_call: jest.fn(),
}));

jest.mock('../../Utils/ChatServiveApiUtils.js', () => ({
    __esModule: true,
    count_new_messgaes_api_call: jest.fn(),
    get_messages_api_call: jest.fn(),
    create_connection_to_stomp_server: jest.fn(),
    send_message_to_stomp_server: jest.fn(),
}));

describe('Chat', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            UserServiceReducer: { isLoggedIn: true, userInfo: {id:10, username:"test username 10"}, jwt_web_token:"test token", logout_message: ""},
        });

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

    it('Chat should update messages state on send button', async () => {

        let component;
        await act(async () => { 
            // const { getByTestId, getByRole, queryAllByRole, debug, container } 
            component =
            render(
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </PersistGate>
                </Provider>
            )}
        );

        const inputElement = screen.getByPlaceholderText('Write your message...');
        fireEvent.change(inputElement, { target: { value: 'hello' } });
        const buttonElement = screen.getByTestId('send-message-button');
        fireEvent.click(buttonElement);
        const messageElement = screen.queryByText('hello');
        expect(messageElement).toBeInTheDocument();
    });


    it('Chat should render profile comonent only after profile button click', async () => {

        let component;
        await act(async () => { 
            // const { getByTestId, getByRole, queryAllByRole, debug, container } 
            component =
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Chat />} />
                            <Route path="/login_register" element={<div></div>} />
                        </Routes>
                    </BrowserRouter>
                </Provider> 
            )}
        );

        const profileComponentBeforeClick = screen.queryByTestId('profile-component');
        expect(profileComponentBeforeClick).toEqual(null);

        const buttonElement = screen.getByTestId('show-profile-button');
        fireEvent.click(buttonElement);
        
        const profileComponentAfterClick = screen.queryByTestId('profile-component');
        expect(profileComponentAfterClick).toBeInTheDocument();
    });

});
