import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth';


import { HighlightCard } from '../../components/HighlightCard/index';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { TouchableOpacity } from 'react-native';


import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    HighlightCards,
    UserGreeting,
    UserName,
    Icon,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HightlightProps {
    amount: string;
    lasTransaction: string;
}

interface HighlightData {
    entries: HightlightProps,
    expensives: HightlightProps,
    total: HightlightProps
}

export function Dashboard() {
    //  const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [hightLightData, setHightLightData] = useState<HighlightData>({} as HighlightData);

    const { signOut, user } = useAuth();

    async function loadTransactions() { //busca informações no AsyncStorage para exibir no Dashboard
        const dataKey = `@gofinances:transactions_user${user.id}`;
        const response = await AsyncStorage.getItem(dataKey); //pegando transações do Asybnc
        const transactions = response ? JSON.parse(response) : [] //formtando dados se existirem

        function getLastTransactionDate(
            collection: DataListProps[],
            type: 'positive' | 'negative'
            ) {
            
                    const collectionFiltered = collection
                    .filter(transaction => transaction.type === type)  
                    
                    if(collectionFiltered.length === 0) //caso n tenha transação positiva ainda 
                    return 'Ainda não houve entradas'

                   //utlima transação - date
                       const lastTransaction = new Date(Math.max.apply(Math,collectionFiltered  //pega a data maior //pegando somente as transações verdes(positivas)
                    .map((transaction => new Date(transaction.date).getTime()) //retornando a data de cada transação //getTime = timestemp = numero q representa data
                    )))

            return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
        }

        let entriesTotal = 0;
        let expensiveTotal = 0;


        const transactionsFormatted: DataListProps[] =
            transactions.map((item: DataListProps) => {

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }


                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', { //moeda
                        style: 'currency',
                        currency: 'BRL'
                    });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            });

        setTransactions(transactionsFormatted);
        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative')
        const totalInterval = `01 a ${lastTransactionExpensives}`

        const total = entriesTotal - expensiveTotal;
        setHightLightData({
            entries: { //dinheiro entrada
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: ` Ultima entrada dia: ${lastTransactionEntries}`,
            },
            expensives: { //dinheiro saida
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lasTransaction: `Ultima saída dia: ${lastTransactionExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lasTransaction: totalInterval,
            }
        });

        setIsLoading(false);

    };

    useEffect(() => {
        loadTransactions()
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions(); //recarregamento
    }, []));

    return (
        <Container>

            {
                isLoading ? <LoadContainer><ActivityIndicator size="large" color="purple" /></LoadContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: user.photo }} />
                                    <User>
                                        <UserGreeting> Olá, </UserGreeting>
                                        <UserName> {user.name} </UserName>
                                    </User>
                                </UserInfo>

                                <TouchableOpacity onPress={signOut}>
                                    <Icon name="power" />
                                </TouchableOpacity>
                            </UserWrapper>
                        </Header>

                        <HighlightCards>
                            <HighlightCard type="up" title="Entradas" amount={hightLightData.entries.amount} lastTransaction={hightLightData.entries.lasTransaction} />
                            <HighlightCard type="down" title="Saidas" amount={hightLightData.expensives.amount} lastTransaction={hightLightData.expensives.lasTransaction} />
                            <HighlightCard type="total" title="Total" amount={hightLightData.total.amount} lastTransaction={hightLightData.total.lasTransaction} />
                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={transactions}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />


                        </Transactions>
                    </>
            }
        </Container>
    )
} 