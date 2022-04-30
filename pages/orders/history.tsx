import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden o no',
        width: 200,
        renderCell: ( params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pagada" variant="outlined" />
                    : <Chip color="error" label="No pagada" variant="outlined" />
            )
        }
    },
    {
        field: 'order',
        headerName: 'Detalles',
        description: 'Ver los detalles de la orden',
        width: 200,
        sortable: false,
        renderCell: ( params: GridValueGetterParams ) => (
            <NextLink href={`/orders/${ params.row.id }`} passHref>
                <Link underline='always'>
                    Ver orden
                </Link>
            </NextLink>
        )
    }
];

const rows = [
    { id: 1, paid: true, fullName: "Marlon Véliz" },
    { id: 2, paid: true, fullName: "Christian Fuentes" },
    { id: 3, paid: false, fullName: "Andrea Campollo" },
    { id: 4, paid: true, fullName: "Mercedez Shoenfeld" },
    { id: 5, paid: false, fullName: "Jhosselinne Matías" },
    { id: 6, paid: true, fullName: "Luis Chaves" },
];

const HistoryPage = () => {
  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
        <Typography variant="h1" component="h1">Historial de ordenes</Typography>
        <Grid container>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default HistoryPage