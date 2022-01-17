import React from 'react'; 
import {
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo, 
    User,
    UserGreeting,
    UserName,
    Icon
} from './styles'; 

export function Dashboard(){
    return (
        <Container>
            <Header>
              <UserWrapper> 
                    <UserInfo>
                        <Photo source={{ uri:"https://avatars.githubusercontent.com/u/56724388?v=4" }}/>
                        <User>
                            <UserGreeting> Olá </UserGreeting>
                            <UserName> Emmanuel </UserName>
                        </User>
                    </UserInfo>

                    <Icon name="power"/> 
                </UserWrapper>
             </Header>
        </Container>
    )
} 