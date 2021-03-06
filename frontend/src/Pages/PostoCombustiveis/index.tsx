import { colors } from '../../helpers/colorsBasic';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

import { Button } from '../../components/Button';
import { ButtonLink } from '../../components/ButtonLink';
import Header from '../../components/Header';
import { Loading } from '../../components/Loading';
import { useEffect, useState } from 'react';
import { FuelItem } from '../../components/Fuel';
import { FuelHelper } from '../../Types/FuelTypeHelper';
import { useUserContext } from '../../contexts/userContext/hooks/useUser';
import { api } from '../../lib/baseURL';
import { useParams } from 'react-router-dom';

type ResponseGetFuels = {
  idPosto: string;
  cnpj: string;
  endereco: string;
  nome: string;
  imgBg: string | null;
  tipos_combustiveis: {
    idTipo: string;
    nome: string;
    valor: number;
  }[];
};

export default function PostoCombustiveis() {
  const { setPickSupply } = useUserContext();
  const [isLoadingFuels, setLoadingFuels] = useState(false);
  const [listFuels, setListFuel] = useState<FuelHelper[]>([]);
  const [disableButton, setDisableButton] = useState(true);

  const { id } = useParams();

  // teste para estilizar
  useEffect(() => {
    const loadFuels = async () => {
      try {
        setLoadingFuels(true);
        const response = await api.get<ResponseGetFuels>(`/posto/${id}`);
        const responseMapped = response.data.tipos_combustiveis.map(fuel => {
          return { data: { ...fuel }, isActive: false };
        });
        setListFuel(responseMapped);
        setLoadingFuels(false);
      } catch (error) {}
    };
    loadFuels();
  }, []);

  const pickFuel = (item: FuelHelper) => {
    let templistFuels = [...listFuels];
    templistFuels.map(element => {
      if (element !== item) {
        element.isActive = false;
      } else {
        element.isActive = true;
      }
    });
    setListFuel(templistFuels);
    setDisableButton(false);
    setPickSupply(item.data.idTipo);
  };

  return (
    <>
      <Header>
        <ButtonLink
          color={`${colors.redButton}`}
          action='/postos'
          text='voltar'>
          <SettingsBackupRestoreIcon />
        </ButtonLink>
        <Button color='#8257E6' text='Combust??veis'>
          <LocalGasStationIcon style={{ color: '#fff' }} />
        </Button>
      </Header>
      <div className='max-w-[900px]  rounded-md bg-bgTheme-700 h-[75vh] max-h[80vh] mx-auto my-12 px-5 py-10 flex flex-col  gap-8 '>
        <div className='w-full flex items-center justify-center'>
          <h2 className='text-white font-semibold text-xl smm:text-base'>
            Selecione o seu combust??vel
          </h2>
        </div>
        {isLoadingFuels ? (
          <div className='w-full flex flex-col gap-1 items-center justify-center flex-1'>
            <Loading />
            <span className='text-white'>Carregando cumbust??veis...</span>
          </div>
        ) : (
          <div className='flex-1 grid grid-cols-3 gap-y-5 justify-between gap-x-6 place-items-center overflow-y-auto p-3 md:grid-cols-2 sd:grid-cols-1'>
            {listFuels?.map((item, key) => (
              <FuelItem key={key} data={item} onClick={() => pickFuel(item)} />
            ))}
          </div>
        )}
        <div
          className={`group flex items-center justify-center  ${
            disableButton ? 'pointer-events-none ' : 'pointer-events-auto '
          }`}>
          <ButtonLink
            action='/pagamento'
            color='#1FA344'
            text='pagamento'
            children={<LocalAtmIcon />}
            state={disableButton}
          />
        </div>
      </div>
    </>
  );
}
