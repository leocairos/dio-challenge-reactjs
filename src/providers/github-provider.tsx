import React, { createContext, useCallback, useState } from "react";
import api from "../services/api";

interface IGithubProviderProps {
  children?: any;
}

interface IUser {
  id: string | undefined,
  avatar: string | undefined,
  login: string | undefined,
  name: string | undefined,
  html_url: string | undefined,
  blog: string | undefined,
  company: string | undefined,
  location: string | undefined,
  followers: BigInteger | any,
  following: BigInteger | any,
  public_gists: BigInteger | any,
  public_repos: BigInteger | any,
}

interface IRepository {
  id: string,
  name: string,
  full_name: string,
}

interface IGithubState {
  hasUser: boolean,
  loading: boolean,
  user: IUser,
  repositories: IRepository[] | any,
  starred: [] | any,
}

interface IGithubContextData {
  githubState: IGithubState,
  getUser(username: string): void,
  getUserRepos(username: string): void,
  getUserStarred(username: string): void,
}

//export const GithubContext = createContext<IGithubContextData>({} as IGithubContextData);
export const GithubContext = createContext<IGithubContextData>({
  githubState: {} as IGithubState,
  getUser: ()=>{},
  getUserRepos: ()=>{},
  getUserStarred: ()=>{},
});

const GithubProvider = ({ children }: IGithubProviderProps) => {
  const [githubState, setGithubState] = useState({
    hasUser: false,
    loading: false,
    user: {
      id: undefined,
      avatar: undefined,
      login: undefined,
      name: undefined,
      html_url: undefined,
      blog: undefined,
      company: undefined,
      location: undefined,
      followers: 0,
      following: 0,
      public_gists: 0,
      public_repos: 0,
    },
    repositories: [],
    starred: [],
  });

  const getUser = (username: string) => {
    setGithubState((prevState) => ({
      ...prevState,
      loading: !prevState.loading,
    }));

    api
      .get(`users/${username}`)
      .then(({ data }) => {
        setGithubState((prevState) => ({
          ...prevState,
          hasUser: true,
          user: {
            id: data.id,
            avatar: data.avatar_url,
            login: data.login,
            name: data.name,
            html_url: data.html_url,
            blog: data.blog,
            company: data.company,
            location: data.location,
            followers: data.followers,
            following: data.following,
            public_gists: data.public_gists,
            public_repos: data.public_repos,
          },
        }));
      })
      .finally(() => {
        setGithubState((prevState) => ({
          ...prevState,
          loading: !prevState.loading,
        }));
      });
  };

  const getUserRepos = (username: string) => {
    api.get(`users/${username}/repos`).then(({ data }) => {
      //console.log("data: " + JSON.stringify(data));
      setGithubState((prevState) => ({
        ...prevState,
        repositories: data,
      }));
    });
  };

  const getUserStarred = (username: string) => {
    api.get(`users/${username}/starred`).then(({ data }) => {
      //console.log("data: " + JSON.stringify(data));
      setGithubState((prevState) => ({
        ...prevState,
        starred: data,
      }));
    });
  };

  const contextValue = {
    githubState,
    getUser: useCallback((username: string) => getUser(username), []),
    getUserRepos: useCallback((username: string) => getUserRepos(username), []),
    getUserStarred: useCallback((username: string) => getUserStarred(username), []),
  };

  return (
    <GithubContext.Provider value={contextValue}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubProvider;
