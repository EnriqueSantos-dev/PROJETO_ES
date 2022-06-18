import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { payment, setAllInfos } from '../../redux/reducers/clientSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/selectRedxu';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { colors } from '../../helpers/colorsBasic';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { formPaymentSchema } from './schemaYupPayment';
import { Input, variantInput } from '../InputForm';
import { api } from '../../lib/baseURL';

import { Client } from '../../redux/reducers/clientSlice';

type Props = {
  sendPayment: (value: boolean) => void;
};

export function FormPayment({ sendPayment }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let dataClient = useAppSelector(state => state.client);

  const [isLoading, setisLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, isSubmitting, isValid, isValidating },
  } = useForm<TypeUserForm>({
    resolver: yupResolver(formPaymentSchema),
    mode: 'onChange',
  });

  interface TypeUserForm {
    valueSupply: number;
    name: string;
    cpf: string;
  }

  const onSumit: SubmitHandler<TypeUserForm> = async ({
    name,
    cpf,
    valueSupply,
  }) => {
    dispatch(setAllInfos({ name, cpf, valueSupply }));
  };

  if (isValid) {
    dispatch(payment(dataClient));
  }

  if (dataClient.loading) {
    console.log('loading');
  }

  if (dataClient.return.success) {
    navigate('/pagamento/concluido');
  }

  return (
    <form
      action=''
      className='flex flex-col gap-6 justify-center  bg-bgTheme-600 rounded-md p-9 w-full '
      onSubmit={handleSubmit(onSumit)}>
      <Controller
        name='valueSupply'
        control={control}
        render={({ field: { onChange, name }, fieldState: { error } }) => (
          <Input
            onChange={e => onChange(Number(e.target.value))}
            error={error?.message}
            type='number'
            label='Quantos litros vai abastecer'
            variant={variantInput.dark}
            placeholder='Digite o valor em litro. Ex: 10 ou 10.3'
            name={name}
          />
        )}
      />
      <Controller
        name='name'
        control={control}
        render={({ field: { onChange, name }, fieldState: { error } }) => (
          <Input
            onChange={onChange}
            error={error?.message}
            type='text'
            label='Nome'
            variant={variantInput.dark}
            placeholder='Digite seu nome'
            name={name}
          />
        )}
      />
      <Controller
        name='cpf'
        control={control}
        render={({ field: { onChange, name }, fieldState: { error } }) => (
          <Input
            onChange={onChange}
            error={error?.message}
            type='text'
            label='CPF'
            variant={variantInput.dark}
            placeholder='Digite seu CPF'
            name={name}
          />
        )}
      />

      <button
        className={` disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-md flex gap- items-center justify-center  px-7 py-2 font-semibold text-base text-white capitalize hover:opacity-80 ease-linear transition-opacity w-[150px] mx-auto`}
        style={{ background: `${colors.greenHighLight}` }}>
        <AttachMoneyIcon />
        pagar
      </button>
    </form>
  );
}
