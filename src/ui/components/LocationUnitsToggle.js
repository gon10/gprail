import React, { useContext } from 'react';
import { UnitsContext } from '../../App'
import SingleOption from './SingleOption'

export default function LocationUnitsToggle(props) {
  const { units, setUnits } = useContext(UnitsContext)

  const inputProps = {
    id: "units",
    name: "units",
    options: [
      { value: "milesYards", label: "miles/yards" },
      { value: "milesChains", label: "miles/chains" },
      { value: "km", label: "kilometres/metres" },
    ],
    defaultValue: {value: units},
    value: units,
    onChange: (e) => {
      setUnits(e.currentTarget.value)
    },
    noLabel: true,
    displayType: "toggle",
    fullWidth: true,
  }

  return <SingleOption {...inputProps} />
}