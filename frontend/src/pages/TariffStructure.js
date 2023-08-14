import {useNavigate, useNavigation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {TARIFF_SIDE} from '../app/lib/config/config';
import {selectStructure, setStructure} from '../app/lib/store/reducers/tariffReducer';
import ScreenTitle from '../shared/ui/ScreenTitle';
import {Page} from '../shared/ui/Page';
import Wrapper from '../shared/ui/Wrapper';
import Main from '../shared/ui/Main';
import styled from 'styled-components';
import ButtonCheckbox from '../shared/ui/ButtonCheckbox';
import {Text} from '../shared/ui/Text';
import Footer from '../shared/ui/Footer';
import Button from '../shared/ui/Button';


const RateFactors = styled.div`
  margin-bottom: 40px;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CentredPlaceholder = styled.div`
  flex: 1;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function TariffStructure({ side }) {
  const navigate = useNavigate();
  const structure = useSelector(selectStructure);
  const dispatch = useDispatch();

  let title = "What affects your rate?";
  let subTitle = `Select all options that affect the price of electricity when you ${side === TARIFF_SIDE.IMPORT ? "buy" : "sell"} it from your supplier.`;

  return (
    <Page>
      <ScreenTitle title={title} subTitle={subTitle} />
      <Wrapper>
        <Main>
          <RateFactors>
            <ButtonCheckbox
              title={"Time of Day"}
              value={structure.hours}
              onChange={(value) =>
                dispatch(
                  setStructure({
                    target: side,
                    structure: {
                      hours: value,
                      days: structure.days,
                      months: structure.months,
                    },
                  })
                )
              }
            />
            <ButtonCheckbox
              title={"Weekday/Weekend"}
              value={structure.days}
              onChange={(value) =>
                dispatch(
                  setStructure({
                    target: side,
                    structure: {
                      hours: structure.hours,
                      days: value,
                      months: structure.months,
                    },
                  })
                )
              }
            />
            <ButtonCheckbox
              title={"Season/Month"}
              value={structure.months}
              onChange={(value) =>
                dispatch(
                  setStructure({
                    target: side,
                    structure: {
                      hours: structure.hours,
                      days: structure.days,
                      months: value,
                    },
                  })
                )
              }
            />

            <ButtonCheckbox
              value={!structure.days && !structure.hours && !structure.months}
              title={"None of the Above"}
              subTitle={"I am on flat rate"}
              onChange={() =>
                dispatch(
                  setStructure({
                    target: side,
                    structure: {
                      hours: false,
                      days: false,
                      months: false,
                    },
                  })
                )
              }
            />
          </RateFactors>
        </Main>
        <Footer>
          <Button
            title={"Next"}
            variant="executive"
            onClick={() => {
              if (structure.months) {
                navigate("/seasons", {
                  state: { side },
                });
              } else {
                navigate("/prices", {
                  state: {
                    side,
                    seasonIndex: 0,
                    daysIndex: 0,
                  }
                });
              }
            }}
          />
        </Footer>
      </Wrapper>
    </Page>
  )
}
