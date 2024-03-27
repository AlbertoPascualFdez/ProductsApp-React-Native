import { Input,Button, Layout, Text } from '@ui-kitten/components'
import { Alert, useWindowDimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { MyIcon } from '../../components/ui/MyIcon'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from '../../navigation/StackNavigator'
import { API_URL, STAGE } from '@env'
import { useState } from 'react'
import { useAuthStore } from '../../store/auth/useAuthStore'

interface Props extends StackScreenProps<RootStackParams, "LoginScreen"> {}

export const LoginScreen = ({navigation}:Props) => {

    const {login} = useAuthStore()
    const [isPosting, setIsPosting] = useState(false)

    const [form, setForm] = useState({
        email:"",
        password:""
    })
    

    const {height} = useWindowDimensions()

    const onLogin = async() =>{
        setIsPosting(true);
        if(form.email.length === 0 || form.password.length === 0)
            return;

        const wasSuccesful = await login(form.email, form.password);
        setIsPosting(false);

        if(wasSuccesful) return;

        Alert.alert("Error", "Usuario o contraseña incorrectos");
    }

   // console.log({apiUrl: API_URL, stage: STAGE})

return (
    <Layout style={{flex:1}}>

        <ScrollView style={{marginHorizontal:40}}>
            <Layout style={{paddingTop: height*0.35}}>
                <Text category='h1'>Iniciar</Text>
                <Text category='p2'>Por favor, inicie sesion para continuar</Text>
            </Layout>

            <Layout style={{marginTop:20}}>
                <Input 
                    placeholder='Correo electronico'
                    keyboardType='email-address'
                    accessoryLeft={<MyIcon name="email-outline"/>}
                    autoCapitalize='none'
                    value={form.email}
                    onChangeText={(email) => setForm({...form,email})}
                    style={{marginBottom:10}}
                />
                 <Input 
                    placeholder='Contraseña'
                    secureTextEntry
                    accessoryLeft={<MyIcon name="lock-outline"/>}
                    autoCapitalize='none'
                    value={form.password}
                    onChangeText={(password) => setForm({...form,password})}
                    style={{marginBottom:10}}
                />
            </Layout>

            <Layout style={{height:10}}/>

            <Layout>
                <Button
                disabled={isPosting}
                    onPress={() => onLogin()}
                    //appearance='ghost'
                    accessoryRight={<MyIcon name="arrow-forward-outline" white/>}
                >
                    Iniciar sesion
                </Button>
            </Layout>

            <Layout style={{height:50}}/>

            <Layout style={{alignItems:"flex-end", flexDirection:"row", justifyContent:"center"}}>
                <Text>¿Aun no tienes cuenta?</Text>
                <Text
                    status='primary'
                    category='s1'
                    onPress={() => navigation.navigate("RegisterScreen")}
                >Crea una cuenta</Text>
            </Layout>

        </ScrollView>

    </Layout>
)
}