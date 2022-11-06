import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import { DirtyGame } from "../../utils/interface";
import styles from "./History.module.scss";

export const History = () => {
  const { getUserCompletedGames } = useDatabaseContext();
  const [list, setList] = useState<ReadonlyArray<DirtyGame>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const temp = getUserCompletedGames()?.data?.games;
    if (temp && Array.isArray(temp) && temp.length > 0) {
      const allGames = temp as ReadonlyArray<DirtyGame>;
      const completedGames = allGames.filter((each) => each.isCompleted);
      setList(completedGames);
    }
  }, []);

  const onPlay = () => {
    navigate("/dashboard");
  };

  return (
    <ValidateLogin>
      <Typography className={styles.container} component={"div"}>
        {list && list.length && list.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight : '600'}}>Id</TableCell>
                    <TableCell style={{fontWeight : '600'}} align="right">Name</TableCell>
                    <TableCell style={{fontWeight : '600'}} align="right">Time taken(in minutes)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((row,index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.puzzle.name}</TableCell>
                      <TableCell align="right">{Math.floor(row.time /60).toString().padStart(2,'0')} : {(row.time % 60).toString().padStart(2,'0')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <Typography className={styles.empty_list} component={"div"}>
              <Typography component={"div"}>
                <img src="./assets/empty.png" alt="empty-list" />
              </Typography>
              <Typography className={styles.text} component={"div"}>
                Oops!! You haven't played any games yet.
              </Typography>
              <Typography component={"div"}>
                <Button onClick={onPlay} className={styles.btn}>
                  Start Playing
                </Button>
              </Typography>
            </Typography>
          </>
        )}
      </Typography>
    </ValidateLogin>
  );
};
