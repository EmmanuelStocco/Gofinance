import React, { useContext, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';

import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg'
                       
import { useAuth } from '../../hooks/auth';
 
import { TouchableOpacity, Text, View, Image } from 'react-native';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
} from './styles';  

export function SignIn() {  
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth(); //usando hook useContext para acessa o hock contexto que quer usar
  const theme = useTheme()

  async function handleSignInWithGoogle() {
    console.log('chamou google')  
    try { 
       setIsLoading(true)
       return await signInWithGoogle(); 
    } catch (error) { 
      console.log(error);
      Alert.alert('Não foi possivel conectar a uma conta google ');
      setIsLoading(false);
    }  
  } 

  async function handleSignInWithApple() {
    console.log('chamou apple') 
    try { 
      setIsLoading(true)
      return await signInWithApple(); 
    } catch (error) { 
      console.log(error);
      Alert.alert('Não foi possivel conectar a conta Apple');
      setIsLoading(false);
    }
    setIsLoading(false);
  } 

   return (
     
           <Container>
             <Header>
               <TitleWrapper>
                  <LogoSvg 
                    width={RFValue(200)}
                    height={RFValue(70)}
                  />
                  <Title> 
                    Controle suas {'\n'}
                     finanças de forma  {'\n'}
                      muito simples
                  </Title>
               </TitleWrapper>

               <SignInTitle>
                 Faça seu Login com{'\n'}
                 uma das contas abaixo
               </SignInTitle>
             </Header>
             
             <Footer>  
                  <View style={estilo.container}  >
                    <TouchableOpacity   
                        onPress={handleSignInWithGoogle}  
                        style={estilo.button}  
                    >   
                           <GoogleSvg 
                              width={RFValue(100)}
                              height={RFValue(50)}
                          
                            />
                        <Text>Entrar com Google  </Text>  
                    </TouchableOpacity>   




                    <TouchableOpacity  
                        onPress={handleSignInWithApple} 
                        style={estilo.button}   
                    > 
                        <AppleSvg 
                          width={RFValue(100)}
                          height={RFValue(50)}                      
                        />
                        <Text>Entrar com Apple </Text>  
                    </TouchableOpacity>   
                </View>

                { isLoading && <ActivityIndicator color={theme.colors.shape}  style={{marginTop: 18}}/> }
             </Footer>  

           </Container>
  
      );
     
    }

    const estilo = StyleSheet.create({
      button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        margin: 5,
        borderRadius: 4,
        flexDirection: 'row', 
        color: 'black',        
      }, 
      container: {
        flex: 2,
        justifyContent: "center",
        paddingHorizontal: 5,
        marginBottom: 150
      },
      stretch: {
        width: 50,
        height: 200,
        resizeMode: 'stretch',
      }
    })
    