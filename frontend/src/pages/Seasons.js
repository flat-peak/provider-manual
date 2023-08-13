import {useDispatch, useSelector} from 'react-redux';
import {
  addSeasonRange,
  findWeekdaySchedule,
  removeSeasonRange,
  selectPlan,
  setSeasonRange,
} from '../app/lib/store/reducers/tariffReducer';
import {Page} from '../shared/ui/Page';
import ScreenTitle from '../shared/ui/ScreenTitle';
import {resolveMonthLabelByKey, TARIFF_MONTHS, TARIFF_SIDE} from '../app/lib/config/config';
import Wrapper from '../shared/ui/Wrapper';
import Footer from '../shared/ui/Footer';
import Button from '../shared/ui/Button';
import {TouchableOpacity} from '../shared/ui/TouchableOpacity';
import {useLocation, useNavigate} from 'react-router-dom';
import FlatList from 'flatlist-react';
import {
  EditableTableBox,
  EditableTableBoxes,
  EditableTableControl,
  EditableTableLabel,
  EditableTableRow,
  EditableTableSelect,
} from '../shared/ui/EditableTable';
import {Delete} from '@styled-icons/material';
import Main from '../shared/ui/Main';


export default function Seasons() {
  const { state } = useLocation();
  const { side } = state;
  const plan = useSelector(selectPlan);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schedule = findWeekdaySchedule(plan[side]);
  const removePeriod = (index) => {
    dispatch(removeSeasonRange({ side, index }));
  };
  const addPeriod = () => {
    dispatch(addSeasonRange({ side }));
  };

  const onChangeMonth = (item, value, type) => {
    dispatch(setSeasonRange({
      side,
      value: value,
      index: schedule.data.indexOf(item),
      type: type,
    }));
  }

  return (
    <Page>
        <ScreenTitle
          title={"Seasonal price changes"}
          subTitle={`Create seasons that match your ${
            side === TARIFF_SIDE.IMPORT ? "import" : "export"
          } tariff. Add more seasons if required.`}
        />
        <Wrapper>
          <Main>
          <FlatList
            list={schedule.data}
            renderItem={(item, index) => {

              let firstMonth = item.months[0] || "";
              let lastMonth =
                item.months.length > 1
                  ? item.months[item.months.length - 1]
                  : "";

              return (
                <EditableTableRow key={index.toString()}>
                  <EditableTableBoxes data-id={'boxes'}>
                    <EditableTableBox
                      isFirst={true}
                    >
                      <EditableTableLabel>From:</EditableTableLabel>
                      <EditableTableSelect value={firstMonth} onChange={(e) => onChangeMonth(item, e.target.value, "from")}>
                        {TARIFF_MONTHS.map((monthKey) => (
                          <option
                            key={monthKey}
                            value={monthKey}
                          >{resolveMonthLabelByKey(monthKey)}</option>
                        ))}
                      </EditableTableSelect>
                    </EditableTableBox>
                    <EditableTableBox>
                      <EditableTableLabel>To:</EditableTableLabel>
                      <EditableTableSelect value={lastMonth} onChange={(e) => onChangeMonth(item, e.target.value, "to")}>
                        {TARIFF_MONTHS.map((monthKey) => (
                          <option
                            key={monthKey}
                            value={monthKey}
                          >{resolveMonthLabelByKey(monthKey)}</option>
                        ))}
                      </EditableTableSelect>
                    </EditableTableBox>
                  </EditableTableBoxes>
                  <EditableTableControl>
                    {schedule.data.length > 1 && (
                      <TouchableOpacity onClick={() => removePeriod(index)}>
                        <Delete width={24} height={24} color="#FF8484" />
                      </TouchableOpacity>
                    )}
                  </EditableTableControl>
                </EditableTableRow>
              );
            }}
          />

          <Button
            size={"small"}
            title={"+ Add season"}
            onClick={() => addPeriod()}
          />
          </Main>

          <Footer>
            <Button
              title={"Next"}
              variant="executive"
              onClick={() =>
                navigate("/prices", {state: {
                  side,
                  seasonIndex: 0,
                  daysIndex: 0,
                }})
              }
            />
          </Footer>
        </Wrapper>
    </Page>
  );
}
