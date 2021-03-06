import React, { useEffect, useState } from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert

 } from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage' ;
import uuid from 'react-native-uuid';
 
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'


import  { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/inputForm'
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import {
     Container,
     Header,
     Title,
     Form,
     Fields,
     TransactionTypes

} from './styles';
import { useAuth } from '../../hooks/auth';

//definindo formato
const schema = Yup.object().shape({
    name:  Yup
            .string()
            .required('Nome é obrigatorio'),
    amount: Yup
            .number()
            .typeError('Informe um valor obrigatorio')
            .positive('O valor não pode ser negativo')
            .required('O valor é obrigatorio')
})

export function Register(){
    const [transactionType, setTransactionType] = useState('positive');
    console.log(transactionType)
    const [categoryModalOpen, setCategoryModalOpen ] = useState(false);

    const { user } = useAuth();
 
    const dataKey = `@gofinances:transactions_user${user.id}`;
 
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    type NavigationProps = { navigate: (screen: string)=> void}
    const navigation = useNavigation<NavigationProps>();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors } //capturando o estado de erros de forma desestruturada
    } = useForm({
        resolver: yupResolver(schema) //definindo padrão de recebimento de valores
    });

    function handleTransactionsTypeSelect(type: 'positive' | 'negative'){
        console.log(transactionType)
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal (){
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal (){
        setCategoryModalOpen(false)
    }

    
    type FormData = {
        [name: string]: any;
      }
      
      //salvando dados de forma asincrona no celular
      async function handleRegister(form: FormData) { 
          if(!transactionType) {
            return Alert.alert('Selecione o tipo de transação');
          }
      
          if(category.key === 'category') {
            return Alert.alert('Selecione a categoria');
          }
      
          const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
          } 

        try{
            const data = await AsyncStorage.getItem(dataKey); //recuperando todos os dados no async storage
            const currentData = data ? JSON.parse(data) : []; //caso tenha algo converta para modificar, caso não retorne array 
            const dataFormatted = [ //dados antigos + atuais
                ...currentData, 
                newTransaction

            ];
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted)); //a função só aceita string

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem');


        } catch(error){
            console.log(error);
            Alert.alert("Não foi possivel salvar");
        }
    }
    
    useEffect(()=> {
       async function loadData() {
         //   buscando dados do storage
           const data = await AsyncStorage.getItem(dataKey);
           console.log(" No registro Async, temos:  ")
           console.log(JSON.parse(data!))
        }

        loadData();
    }, []);


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                        <Title> Cadastro </Title>  
                    </Header>  

                    <Form>
                        <Fields>
                            <InputForm
                                name="name"
                                control={control}
                                placeholder='Titulo' 
                                autoCapitalize='sentences'
                                autoCorrect={false} 
                                error={errors.name && errors.name.message}                            
                            />
                            <InputForm
                                name="amount"
                                control={control}
                                placeholder='Valor'
                                keyboardType='numeric' 
                                error={errors.amount && errors.amount.message}                             
                            /> 
                            <TransactionTypes>
                                <TransactionTypeButton
                                    type="up"
                                    title="Entradas"
                                    onPress={() => handleTransactionsTypeSelect('positive')}
                                    isActive={transactionType === 'positive' }
                                />
                                <TransactionTypeButton
                                    type="down"
                                    title="Saídas"
                                    onPress={() => handleTransactionsTypeSelect('negative')}
                                    isActive={transactionType === 'negative' }
                                />
                            </TransactionTypes>

                            <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                            />
                        </Fields>

                        <Button 
                                title="Enviar"
                                onPress={handleSubmit(handleRegister)}
                            />

                        <Modal visible={categoryModalOpen}>
                            <CategorySelect 
                                category = {category}
                                setCategory ={setCategory}
                                closeSelectCategory = {handleCloseSelectCategoryModal}
                            />
                        </Modal>
    
                      
                    </Form>

                    
            </Container>
        </TouchableWithoutFeedback>
    );
}