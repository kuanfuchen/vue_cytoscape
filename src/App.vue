<template>
  <div>
    <h3>
      {{ cytoName }}
    </h3>
    <div >
      <div class="row">
        <div class="col">
          <div id="cy" style="width:80vw;height: 85vh;"></div>
        </div>
        <div class="selectSideBar" style="width:300px">
          <div class="q-py-md q-pr-sm">
            <q-card dark bordered class="bg-grey-9 my-card">
              <q-card-section>
                <div class="text-h6">Select information</div>
                <!-- <div class="text-subtitle2">by John Doe</div>
                <div class="text-subtitle2">by John Doe</div> -->
                <q-select outlined v-model="selectedValue" 
                bg-color="white" class="q-mt-md" 
                :options="selectOption" label="Select" ></q-select>
              </q-card-section>
              <div class="row q-mb-sm">
                <div class="text-h6 text-info col-10 q-pl-md">{{ selectedValue }}</div>
                <q-btn flat dense color="grey" class="col-2"
                :icon="extendTextInfo ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="extendTextInfo = !extendTextInfo"
                ></q-btn>
              </div>
              <q-slide-transition>
                <div v-show="extendTextInfo">
                <q-separator dark inset></q-separator>
                <q-card-section class="sideBarText">
                  <div v-for="(item,index) in allInfoSort" :key="index" class="q-mt-sm row"
                  >
                    <div class="col-10 row">
                      <span class="selectCub" 
                      :style="cubBgStyle[index]"></span>
                      <span >{{item[0]}}</span>
                    </div>
                    <div class="col-2">{{item[1]}}</div>
                  </div>
                </q-card-section>
              </div>
              </q-slide-transition>
              <q-card-section>
                <div class="text-h6">Select group</div>
                <!-- <div class="text-subtitle2">by John Doe</div>
                <div class="text-subtitle2">by John Doe</div> -->
                <q-select outlined v-model="groupSelectedVal" 
                bg-color="white" class="q-mt-md"
                :options="groupSelectOption" label="Select" >
                </q-select>
              </q-card-section class="sideBarText">
              
                <div v-if="groupSelectedVal !=='None'">
                  <div class="row q-mb-sm">
                    <div class="text-h6 text-lime col-10 q-pl-md">{{ groupSelectedVal }}</div>
                    
                  </div>
                  <q-separator dark inset></q-separator>
                  
                </div>
                <q-card-section>
                  <div v-for="(item,index) in groupSort" :key="index" class="q-mt-sm row">
                    <div class="col-12 row ">
                      <span class="selectCub" 
                        :style="{background:groupStyleBg[index]}">
                      </span>
                      <span >{{item}}</span>
                    </div> 
                  </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <q-btn color="primary" label="Primary" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <!-- <RouterView /> -->
</template>
<script setup>
// import { RouterLink, RouterView } from 'vue-router';
// import HelloWorld from './components/HelloWorld.vue';
import {ref, watch, reactive, onMounted} from 'vue';
import CyNewJSON from './josnlist/RtoCytNew.json';
const cytoName = ref('')
const selectOption = ref(['Phylum','Class','Order','Family','Genus','Species']);
const selectedValue = ref('Phylum');
const groupSelectOption = ref(['None','Betweenness','RandomWalks','Louvain','Greedy','Leading_eigen']);
const groupSelectedVal = ref('None');
const allInfoSort = ref([]);
const extendTextInfo = ref(true);
const groupSort=ref([])
const cubBgStyle = ref([
  {
    backgroundColor:'#A6CEE3'
  },{
    backgroundColor:'#1F78B4'
  },{
    backgroundColor:'#B2DF8A'
  },{
    backgroundColor:'#33A02C'
  },{
    backgroundColor:'#FB9A99'
  },{
    backgroundColor:'#E31A1C'
  },{
    backgroundColor:'#FDBF6F'
  },{
    backgroundColor:'#FF7F00'
  },{
    backgroundColor:'#CAB2D6'
  },{
    backgroundColor:'#6A3D9A'
  }
]);
const groupStyleBg = ref(['#f8dfc2','#f0ece6','#d0e6da','#ebffac','#c1f1fc','#dbebfa']);
const cytoscapePlotFn = ()=>{
  extendTextInfo.value = true;
  allInfoSort.value = [];
  groupSort.value = [];
  // console.log(CyNewJSON,'CyNewJSON');
  cytoName.value = CyNewJSON.data.name;
  const dataArrNodes = CyNewJSON.elements.nodes;
  const dataArrEdges = CyNewJSON.elements.edges;
  console.log(dataArrNodes, 'dataArrNodes')
  console.log(dataArrEdges,'dataArrEdges')
  let edgesInteraction = [];
  for(let i = 0;dataArrEdges.length>i;i++){
    if(!edgesInteraction[dataArrEdges[i].data.interaction]){
      edgesInteraction[dataArrEdges[i].data.interaction] = 1
    }else{
      edgesInteraction[dataArrEdges[i].data.interaction]++
    }
  }
  let nodesSize = [];
  for(let i=0; dataArrNodes.length > i;i++){
    nodesSize.push(dataArrNodes[i].data.size)
  }
  for(let i=0 ; dataArrNodes.length>i;i++){
    if(!dataArrNodes[i]['group']){
      dataArrNodes[i]['group'] = 'nodes';
    };
    if(!dataArrNodes[i].data['score']){
      let nodeScore = nodesSize[i]/100;
        dataArrNodes[i].data['score'] = nodeScore;
    };
    if(!dataArrNodes[i].data['class']){
      dataArrNodes[i].data['class'] = dataArrNodes[i].data.Order;
    }
    if(!dataArrNodes[i].data['parent']){
      dataArrNodes[i].data['parent'] = dataArrNodes[i].data[groupSelectedVal.value];
    }
    console.log(dataArrNodes[i].data['parent'])
  }
    let dataParent = [];
    for(let i=0;dataArrNodes.length>i;i++){
      const dataParentIndexOf = dataParent.indexOf(dataArrNodes[i].data[groupSelectedVal.value])
      if(dataParentIndexOf === -1){
        dataParent.push(dataArrNodes[i].data[groupSelectedVal.value])
      }
    }      
    console.log(dataParent);
    if(groupSelectedVal.value !== 'None'){
      for(let i=0;dataParent.length>i;i++){
        if(dataParent[i] !== 'uncluster'){
            dataArrNodes.push({
            data:{
              id:dataParent[i],
              name:dataParent[i],
            }
          })
          groupSort.value.unshift(dataParent[i])
        }
      }
    }
    for(let i=0;dataArrEdges.length>i;i++){
      if(!dataArrEdges[i]['group']){
        dataArrEdges[i]['group'] = 'edges'
      };
    }      
    const array = dataArrNodes.concat(dataArrEdges)
    let selectArr = [];
    for(let i=0;dataArrNodes.length>i;i++){
      if(!selectArr[dataArrNodes[i].data[selectedValue.value]]){
        selectArr[dataArrNodes[i].data[selectedValue.value]] = 1
      }else{
        selectArr[dataArrNodes[i].data[selectedValue.value]]++
      }
    }    
    const selectArrObj = Object.entries(selectArr);
    for(let i=0;selectArrObj.length - 1>i;i++){
        for(let j=0;selectArrObj.length -1 -i>j;j++){
          if(selectArrObj[j][1]>selectArrObj[j+1][1]){
            [selectArrObj[j],selectArrObj[j+1]] = [selectArrObj[j+1],selectArrObj[j]]
          }
        }
    }
    let selectSort = [];
    for(let i =selectArrObj.length - 1;i>=0;i--){
      let len = selectArrObj.length - 10;
      if(i >= len){
        selectSort.push(selectArrObj[i])
      }
    }
    for(let i=0;selectArrObj.length>i;i++){
      allInfoSort.value.unshift(selectArrObj[i])
    }
    const selectItem = selectedValue.value;
    const cy = window.cy = cytoscape({
            container: document.getElementById('cy'),
            ready: function(){
              let layoutUtilities = this.layoutUtilities({
                desiredAspectRatio: this.width()/this.height()
              });              
              this.layout({name: 'fcose', animationEasing: 'ease-out'}).run();
            },
            // 
            layout: {
              name: 'grid',
              idealEdgeLength: 100,
              nodeOverlap: 20,
              refresh: 20,
              fit: true,
              padding: 30,
              randomize: false,
              componentSpacing: 100,
              nodeRepulsion: 400000,
              edgeElasticity: 100,
              nestingFactor: 5,
              gravity: 80,
              numIter: 1000,
              initialTemp: 200,
              coolingFactor: 0.95,
              minTemp: 1.0
            },
            elements: array,
            style:[
              {
                "selector": "core",
                "style": {
                  "selection-box-color": "#AAD8FF",
                  "selection-box-border-color": "#8BB0D0",
                  "selection-box-opacity": "0.5"
                }
              }, {
                "selector": "node",
                "style": {
                  "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
                  "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
                  "content": "data(name)",
                  "font-size": "12px",
                  "text-valign": "center",
                  "text-halign": "center",
                  "background-color": "#555",
                  "text-outline-color": "#555",
                  "text-outline-width": "2px",
                  "color": "#fff",
                  "overlay-padding": "6px",
                  "z-index": "10"
                }
              }, {
                "selector": "node[?attr]",
                "style": {
                  "shape": "rectangle",
                  "background-color": "#aaa",
                  "text-outline-color": "#aaa",
                  "width": "16px",
                  "height": "16px",
                  "font-size": "6px",
                  "z-index": "1"
                }
              }, {
                "selector": "node[?query]",
                "style": {
                  "background-clip": "none",
                  "background-fit": "contain"
                }
              }, {
                "selector": "node:selected",
                "style": {
                  "border-width": "6px",
                  "border-color": "#AAD8FF",
                  "border-opacity": "0.5",
                  "background-color": "#77828C",
                  "text-outline-color": "#77828C"
                }
              },
              {
                "selector": selectSort.length>=1?`node[id=\"${groupSort.value[0]}\"]`:undefined,
                "style": {
                  "background-color": '#f8dfc2',
                  
                }
              },
              {
                "selector": selectSort.length>=2?`node[id=\"${groupSort.value[1]}\"]`:undefined,
                "style": {
                  "background-color": '#f0ece6',
                  
                }
              },
              {
                "selector": selectSort.length>=3?`node[id=\"${groupSort.value[2]}\"]`:undefined,
                "style": {
                  "background-color": '#d0e6da',
                  
                }
              },
              {
                "selector": selectSort.length>=4?`node[id=\"${groupSort.value[3]}\"]`:undefined,
                "style": {
                  "background-color": '#ebffac',
                  
                }
              },
              {
                "selector": selectSort.length>=5?`node[id=\"${groupSort.value[4]}\"]`:undefined,
                "style": {
                  "background-color": '#c1f1fc',
                  
                }
              },
              {
                "selector": selectSort.length>=6?`node[id=\"${groupSort.value[5]}\"]`:undefined,
                "style": {
                  "background-color": '#dbebfa',
                  
                }
              },
              {
                "selector": selectSort.length>=1?`node[${selectItem}=\"${selectSort[0][0]}\"]`:undefined,
                "style": {
                  "background-color": "#A6CEE3",
                  
                }
              }, 
              {
                "selector": selectSort.length>=2?`node[${selectItem}=\"${selectSort[1][0]}\"]`:undefined,
                "style": {
                  "background-color": "#1F78B4"
                }
              }, 
              {
                "selector": selectSort.length>=3?`node[${selectItem}=\"${selectSort[2][0]}\"]`:undefined,
                "style": {
                  "background-color": "#B2DF8A"
                }
              }, 
              {
                "selector":selectSort.length>=4? `node[${selectItem}=\"${selectSort[3][0]}\"]`:undefined,
                "style": {
                  "background-color": "#33A02C"
                }
              }, 
              {
                "selector": selectSort.length>=5?`node[${selectItem}=\"${selectSort[4][0]}\"]`:undefined,
                "style": {
                  "background-color": "#FB9A99"
                }
              }, 
              {
                "selector": selectSort.length>=6?`node[${selectItem}=\"${selectSort[5][0]}\"]`:undefined,
                "style": {
                  "background-color": "#E31A1C"
                }
              }, 
              {
                "selector": selectSort.length>=7?`node[${selectItem}=\"${selectSort[6][0]}\"]`:undefined,
                "style": {
                  "background-color": "#FDBF6F"
                }
              }, 
              {
                "selector": selectSort.length>=8?`node[${selectItem}=\"${selectSort[7][0]}\"]`:undefined,
                "style": {
                  "background-color": "#FF7F00"
                }
              }, 
              {
                "selector": selectSort.length>=9?`node[${selectItem}=\"${selectSort[8][0]}\"]`:undefined,
                "style": {
                  "background-color": "#CAB2D6"
                }
              }, 
              {
                "selector": selectSort.length>=10?`node[${selectItem}=\"${selectSort[9][0]}\"]`:undefined,
                "style": {
                  "background-color": "#6A3D9A"
                }
              }, 
              {
                "selector": "edge",
                "style": {
                  "curve-style": "haystack",
                  "haystack-radius": "0.5",
                  "opacity": "0.4",
                  "line-color": "#bbb",
                  "width": "mapData(weight, 0, 1, 1, 8)",
                  "overlay-padding": "3px"
                }
              }, {
                "selector": "node.unhighlighted",
                "style": {
                  "opacity": "0.2"
                }
              }, {
                "selector": "edge.unhighlighted",
                "style": {
                  "opacity": "0.05"
                }
              }, {
                "selector": ".highlighted",
                "style": {
                  "z-index": "999999"
                }
              }, {
                "selector": "node.highlighted",
                "style": {
                  "border-width": "6px",
                  "border-color": "#AAD8FF",
                  "border-opacity": "0.5",
                  "background-color": "#394855",
                  "text-outline-color": "#394855"
                }
              }, {
                "selector": "edge.filtered",
                "style": {
                  "opacity": "0"
                }
              },
              {
                "selector": "edge[interaction=\"neg\"]",
                "style": {
                  "line-color": "#ee4f4f"
                }
              },
              {
                "selector": "edge[interaction=\"pos\"]",
                "style": {
                  "line-color": "#168eea"
                }
              } 
            ],
          });
          
        // }
      // );
    // }
}
onMounted(async()=>{
  await cytoscapePlotFn()
})

  
</script>
<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
