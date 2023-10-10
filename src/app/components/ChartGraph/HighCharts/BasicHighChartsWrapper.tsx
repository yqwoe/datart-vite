import { FC, memo, useContext } from 'react';
import { Col, Row, Select } from 'antd';
import ChartDrillContext from 'app/contexts/ChartDrillContext';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import styled from 'styled-components';

const BasicHighChartsWrapper: FC<{
  leftData: any[];
  rightData: any[];
  leftName: string;
  rightName: string;
  graphType: string;
}> = memo(props => {
  const { leftData, rightData, leftName, rightName } = props;
  const {
    drillOption,
    onDrillOptionChange,
    availableSourceFunctions,
    onDateLevelChange,
  } = useContext(ChartDrillContext);

  const options = {
    chart: {
      zoomType: 'x',
    },
    boost: {
      useGPUTranslations: true,
    },
    title: {
      text: '',
    },
    subtitle: {
      text: document.ontouchstart === undefined ? ' ' : ' ',
    },
    credits: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    plotOptions: {
      series: {
        //cropThreshold: 300,
        dataGrouping: {
          enabled: false,
        },
      },
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y',
      },
      events: {
        // setExtremes(e) {
        //   if (
        //     e.min != that.checkDate[0].getTime() &&
        //     e.max != that.checkDate[1].getTime()
        //   ) {
        //     that.zoom = null;
        //     that.$set(that.checkDate, 0, new Date(e.min));
        //     that.$set(that.checkDate, 1, new Date(e.max));
        //   }
        // },
      },
    },
    tooltip: {
      split: false,
      shared: true,
      dateTimeLabelFormats: {
        day: '%Y-%m-%d',
        week: '%m-%d',
        month: '%Y-%m',
        year: '%Y',
      },
    },
    yAxis: [
      {
        opposite: false,
      },
      {
        type: 'logarithmic',
        labels: {
          step: 2,
        },
        gridLineWidth: 0,
      },
    ],
    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'top',
    },
    series: [
      {
        type: 'line',
        id: 'lineaddress',
        name: leftName,
        data: leftData,
        lineWidth: 1,
        color: '#f7931a',
      },
      {
        type: 'line',
        name: rightName,
        data: rightData,
        lineWidth: 1,
        color: '#808080',
        yAxis: 1,
      },
    ],
    scrollbar: {
      enabled: false,
    },
  };
  return (
    <ChartWrapper>
      <Row>
        <Col>
          <Select
            onChange={() => {
              // onDrillOptionChange?.(drillOption);
            }}
          >
            <Select.Option key="1" value="1">
              1
            </Select.Option>
            <Select.Option key="2" value="2">
              2
            </Select.Option>
            <Select.Option key="3" value="3">
              3
            </Select.Option>
            <Select.Option key="4" value="4">
              4
            </Select.Option>
          </Select>
        </Col>
        <Col></Col>
      </Row>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        {...props}
      />
    </ChartWrapper>
  );
});

const ChartWrapper = styled.div``;

export default BasicHighChartsWrapper;
