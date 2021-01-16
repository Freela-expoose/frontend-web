import React, {useEffect} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { MdDelete, MdAdd, MdSearch } from 'react-icons/md';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton'
import { useHistory } from 'react-router-dom';

import './styles.css';
import api from '../../../../services/api';



// interface Data {
//   calories: number;
//   carbs: number;
//   fat: number;
//   name: string;
//   protein: number;
// }

interface Data {
  _id: string;
  name: string;
  email: string;
  points: number;
}

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ): Data {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

type ModalType = 'add' | 'delete';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}


// const headCells: HeadCell[] = [
//   { id: 'name', numeric: false, disablePadding: false, label: 'Dessert (100g serving)' },
//   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Nome' },
  { id: '_id', numeric: true, disablePadding: false, label: 'ID' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'points', numeric: true, disablePadding: false, label: 'Pontos' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" >

        </TableCell>
      </TableRow>
    </TableHead>
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.type === 'light' ? '#424242' : 'white'
    },
    paper: {
      maxWidth: '70%',
      margin: 'auto',
      marginBottom: theme.spacing(2),
      marginTop: 80,
    },
    table: {
      minWidth: 750,
      
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },

    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 0,
      border: 0
    },

    container: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },

    button: {
      marginRight: 24,
    },

    margin: {
      marginBottom: 16
    },

    marginSearch: {
      margin: 8
    }

  }),
);


const UserTable: React.FC = () => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Data>({} as Data);
  const [modalType, setModalType] = React.useState<ModalType>('add');
  const [rows, setRow] = React.useState<Data[]>([] as Data[]);
  const [search, setSearch] = React.useState<string>("");
  let points = 0;

  const history = useHistory();
  const currentUser = JSON.parse(String(localStorage.getItem("@Expose:user")));
  const token = localStorage.getItem("@Expose:token");


  // TODO: Carregar todos os dados da lista
  useEffect(() => {
    // console.log(api.defaults.headers.common['Authorization']);
    if(currentUser && token){
      // console.log("Token",token)
      api.get('profile/getall', {
        params: {
          type: currentUser.type
        },
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then(res => {
        if(res.data){
          setRow(res.data);
        }else {
          alert("Sem usuários")
        }
      }).catch(err => alert(err.message));
    }else {
      history.push("/");
    }
    
  }, []);

  const refreshTable = () => {
    api.get('profile/getall', {
      params: {
        type: currentUser.type
      },
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(res => {
      if(res.data){
        setRow(res.data);
      }else {
        alert("Sem usuários")
      }
    }).catch(err => alert(err.message));
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value } = event.target;
    event.preventDefault();

    points= Number(value);
  };

  // TODO: Modal confirmando o Delete
  function handleModalDelete(rowData: Data){
    setCurrentRow(rowData);
    setModalType('delete');
    setOpenModal(true);
  }

  function refreshPage() {
    window.location.reload();
  }

  // TODO: Modal para adicionar pontos
  function handleModalAddPoint(rowData: Data){
    // alert('Adicionar!!!' + rowData.name);
    setCurrentRow(rowData);
    setModalType('add');
    setOpenModal(true);
  }

  function handleDelete(){
   if(currentUser && token){
      api.delete('profile/delete', {
        params: {
          email: currentRow.email,
          type: currentUser.type
        },
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((res) => {
        alert(res.data.deleted + ' Deletado com sucesso!!!');
        // refreshPage();
        refreshTable();
      } ).catch(err => alert(err.message)).finally(() => setOpenModal(false));
   }
  }


  function handleAddPoint(){
    console.log(points);
      api.patch('points/update', {
        value: points,
        email: currentRow.email
      },{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }).then(res => {
        alert('Adicionado com sucesso!!!');
        // refreshPage();
        refreshTable();
      }).catch(err => alert(err.message)).finally(() => setOpenModal(false));
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setSearch(value);
    // handleSearchClick();
  }

  function handleSearchClick() {
    // if(search !== ""){
    //   api.get('admin/getCouponList', {
    //     params: {
    //       value: search
    //     }
    //   }).then(res => {
    //     setRow(res.data);
    //   }).catch(err => console.log(err.message));
    // }
    alert(search);
  }

  function CustomModal(){

    if(modalType === 'add'){
      return(
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            onClose={() => setOpenModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openModal}>
              <div className={classes.container} id="modal">
                <h2 >Adicionar ponto para {currentRow.name}</h2>
                <form  noValidate autoComplete="off" >
                  <div>
                    <TextField 
                      id="points"
                      onChange={handleChangeTextField}
                      name="value"
                      variant="filled"
                      label="Pontos"
                      className={classes.margin}
                      defaultValue={points}
                      required={true}
                      type="number"
                      fullWidth
                      color="secondary"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Button variant="contained" onClick={handleAddPoint} color="primary">
                      Enviar
                    </Button>
                  </div>
                </form>
              </div>
            </Fade>
        </Modal>
      );
    } else {
      return(
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            onClose={() => setOpenModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openModal}>
              <div className={classes.container}>
                <h2 id="transition-modal-title">Deseja continuar</h2>
                <p id="transition-modal-description">Quer mesmo deletar {currentRow.name}?</p>

                <div id="button-group">
                    <Button variant="contained" color="primary" className={classes.button} onClick={handleDelete} type="submit">
                      Sim
                    </Button>

                    <Button variant="contained" color="primary" onClick={() => setOpenModal(false)}>
                      Não
                    </Button>
                </div>
              </div>
            </Fade>
        </Modal>
      );
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <h1 id="titlePage">Tabela dos usuários</h1>
      <Paper className={classes.paper} >
        <TextField
            id="search-input"
            label="Pesquisar"
            variant="filled"
            color="secondary"
            onChange={handleSearchChange}
            value={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchClick}>
                    <MdSearch/>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className={classes.marginSearch}
          />

        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row._id.substring(0, 13) + "..."}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.points}</TableCell>
                      <TableCell align="right" >
                        {/* <IconButton  color="primary"  arial-label="delete" size="medium">
                          <MdAdd/>
                        </IconButton>

                        <IconButton  color="secondary" arial-label="delete" size="medium">
                          <MdDelete/>
                        </IconButton> */}

                        <button className="custom-button blue" onClick={() => handleModalAddPoint(row)}>
                          <MdAdd/>
                        </button>
                        
                        <button className="custom-button red" onClick={() => handleModalDelete(row)}>
                          <MdDelete/>
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <CustomModal/>
      
    </div>
  );
}

export default UserTable;