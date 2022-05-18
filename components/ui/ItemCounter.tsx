import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
  currentValue: number;
  maxValue: number;
  updatedQuantity: (value: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {
  return (
    <Box display="flex" alignItems="center" >
        <IconButton
          onClick={ () => updatedQuantity(-1) }
        >
          <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: "center" }}>{ currentValue }</Typography>
        {
          ( currentValue < maxValue ) && (    
              <IconButton
                onClick={ () => updatedQuantity(1) }
              >
                <AddCircleOutline />
              </IconButton>
            )
        }
    </Box>
  )
}
