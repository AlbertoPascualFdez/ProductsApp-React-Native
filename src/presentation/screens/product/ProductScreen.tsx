import { ButtonGroup, Button, Input, Layout, Text, useTheme } from "@ui-kitten/components"
import { MainLayout } from "../../layouts/MainLayout"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { getProductById } from "../../../actions/products/get-product-by-id"
import { useRef } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { Gender, Product, Size } from "../../../domain/entities/product"
import { MyIcon } from "../../components/ui/MyIcon"
import { Formik } from "formik"
import { updateCreateProduct } from "../../../actions/products/update-create-product"
import { ProductImages } from "../../components/products/ProductImages"
import { CameraAdapter } from "../../../config/api/adapters/camera-adpater"



const sizes: Size[] = [
    Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl
]
const genders: Gender[] = [Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex]


interface Props extends StackScreenProps<RootStackParams, "ProductScreen"> { }

export const ProductScreen = ({ route }: Props) => {

    //porque el id cambia al guardar un nuevo producto, peor no es encesario recargar toda la pagina
    const productIdRef = useRef(route.params.productId)

    const theme = useTheme();

    const queryClient = useQueryClient();

    //const{productId} = route.params;

    const { data: product } = useQuery({
        queryKey: ["product", productIdRef.current],
        queryFn: () => getProductById(productIdRef.current)
    })

    const mutation = useMutation({
        mutationFn: (data: Product) => updateCreateProduct({ ...data, id: productIdRef.current }),
        onSuccess(data: Product) {
            console.log("Success")
            productIdRef.current = data.id;
            queryClient.invalidateQueries({queryKey:["products", "infinite"]})
            queryClient.invalidateQueries({queryKey:["product", productIdRef.current]})
           // queryClient.setQueryData(["product", productIdRef.current], data) //habria que remapear las imagenes de data para generar la url completa
        }
    })




    if (!product)
        return <MainLayout title="Cargando..." />

    return (
        <Formik
            initialValues={product}
            onSubmit={values => mutation.mutate(values)}


        >
            {
                ({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
                    <MainLayout
                        title={values.title}
                        subtitle={`Precio: ${values.price}`}
                        rightAction={async() => {
                            //const photos = await CameraAdapter.takePicture();
                            const photos = await CameraAdapter.getPicturesFromLibrary()
                            console.log({photos})
                            setFieldValue("images", [...values.images, ...photos])

                        }}
                        rightActionIcon="camera-outline"
                    >
                        <ScrollView style={{ flex: 1 }}>

                            <Layout style={{marginVertical:10, justifyContent:"center", alignItems:"center"}}>

                                <ProductImages images={values.images}/>
                                
                            </Layout>

                            <Layout style={{ marginHorizontal: 10 }}>
                                <Input
                                    label="Titulo"
                                    value={values.title}
                                    style={{ marginVertical: 5 }}
                                    onChangeText={handleChange("title")}
                                />
                                <Input
                                    label="Slug"
                                    value={values.slug}
                                    style={{ marginVertical: 5 }}
                                    onChangeText={handleChange("slug")}
                                />
                                <Input
                                    label="Descripcion"
                                    multiline
                                    numberOfLines={5}
                                    value={values.description}
                                    style={{ marginVertical: 5 }}
                                    onChangeText={handleChange("description")}
                                />
                            </Layout>

                            <Layout style={{ marginVertical: 5, marginHorizontal: 10, flexDirection: "row", gap: 10 }}>
                                <Input
                                    label="Precio"
                                    value={values.price.toString()}
                                    style={{ flex: 1 }}
                                    onChangeText={handleChange("price")}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Stock"
                                    value={values.stock.toString()}
                                    style={{ flex: 1 }}
                                    onChangeText={handleChange("stock")}
                                    keyboardType="numeric"
                                />
                            </Layout>

                            <Layout>
                                <ButtonGroup style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }} size="small" appearance="outline">
                                    {sizes.map(size => (
                                        <Button key={size}
                                            style={{
                                                flex: 1,
                                                backgroundColor: values.sizes.includes(size) ? theme["color-primary-200"] : undefined
                                            }}
                                            onPress={() => setFieldValue(
                                                "sizes",
                                                values.sizes.includes(size) ?
                                                    values.sizes.filter(s => s !== size)
                                                    : [...values.sizes, size]
                                            )}
                                        >{size}</Button>
                                    ))}
                                </ButtonGroup>


                                <ButtonGroup style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }} size="small" appearance="outline">
                                    {genders.map(gender => (
                                        <Button key={gender}
                                            style={{
                                                flex: 1,
                                                backgroundColor: values.gender.startsWith(gender) ? theme["color-primary-200"] : undefined
                                            }}
                                            onPress={() => setFieldValue("gender", gender)}
                                        >{gender}</Button>
                                    ))}
                                </ButtonGroup>


                            </Layout>


                            <Button
                                style={{ margin: 15 }}
                                accessoryLeft={<MyIcon name="save-outline" white />}
                                onPress={() => { handleSubmit() }}
                                disabled={mutation.isPending}
                            >Guardar</Button>

                            {/* <Text>{JSON.stringify(values, null, 2)}</Text> */}

                     

                            <Layout style={{ height: 200 }} />

                        </ScrollView>
                    </MainLayout>
                )

            }


        </Formik>
    )
}