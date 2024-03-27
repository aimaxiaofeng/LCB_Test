import { _decorator, Component, Node, EditBox, Button, Color, Graphics, Vec2 } from 'cc';  
  
const { ccclass, property } = _decorator;  
  
@ccclass('Q1')  
export class Q1 extends Component {  
  
    @property(EditBox)  
    private xInput: EditBox = null!;  
  
    @property(EditBox)  
    private yInput: EditBox = null!;  
  
    @property(Button)  
    private generateButton: Button = null!;  
  
    @property(Graphics) 
    private graphics: Graphics = null!;  
  
    // 初始化函数  
    onLoad() {
        this.generateButton.node.on(Node.EventType.TOUCH_END, this.onGenerateButtonClicked, this);  
    }  
  
    // 生成按钮点击事件处理  
    onGenerateButtonClicked() {  
        const xValue = parseInt(this.xInput.string, 10);  
        const yValue = parseInt(this.yInput.string, 10);  
        if (isNaN(xValue) || isNaN(yValue)) {  
            console.error('请输入有效的X和Y值！');  
            return;  
        }  
        this.generateMatrix(10, 10, xValue, yValue);  
    }  
  
    // 生成矩阵并绘制  
    generateMatrix(width: number, height: number, xProbability: number, yProbability: number) {  
        // 清除之前的绘制  
        this.graphics.clear();  
  
        // 定义5种颜色  
        const colors: Color[] = [  
            new Color(255, 0, 0, 255),    // 红色  
            new Color(0, 255, 0, 255),    // 绿色  
            new Color(0, 0, 255, 255),    // 蓝色  
            new Color(255, 255, 0, 255),  // 黄色  
            new Color(255, 0, 255, 255),  // 紫色  
        ];  
  
        // 初始化矩阵  
        const matrix: number[][] = new Array(height);  
        for (let i = 0; i < height; i++) {  
            matrix[i] = new Array(width).fill(0);  
        }  
  
        // 初始化基准概率  111
        const baseProbabilities = colors.map(() => 1 / colors.length);  
  
        // 遍历矩阵并设置颜色  
        for (let m = 0; m < height; m++) {  
            for (let n = 0; n < width; n++) {  
                // 计算调整后的概率  
                let adjustedProbabilities = baseProbabilities.slice();  
                if (m > 0) {  
                    adjustedProbabilities[matrix[m - 1][n]] += yProbability / 100;  
                }  
                if (n > 0) {  
                    adjustedProbabilities[matrix[m][n - 1]] += yProbability / 100;  
                }  
                if (m > 0 && n > 0) {  
                    if (matrix[m - 1][n] === matrix[m][n - 1]) {  
                        adjustedProbabilities[matrix[m - 1][n]] += (xProbability - yProbability) / 100;  
                    } else {  
                        adjustedProbabilities[matrix[m - 1][n]] += xProbability / 100;  
                        adjustedProbabilities[matrix[m][n - 1]] += xProbability / 100;  
                    }  
                }  
  
                // 重新计算剩余颜色的概率  
                const remainingProbability = 1 - adjustedProbabilities.reduce((sum, prob) => sum + prob, 0);
                for (let i = 0; i < adjustedProbabilities.length; i++) {
                    adjustedProbabilities[i] = (adjustedProbabilities[i] / remainingProbability);
                }
                // 根据调整后的概率随机选择颜色  
                const random = Math.random();  
                let sumProb = 0;  
                for (let i = 0; i < adjustedProbabilities.length; i++) {  
                    sumProb += adjustedProbabilities[i];  
                    if (random <= sumProb) {  
                        matrix[m][n] = i;  
                        break;  
                    }  
                }  

                // 绘制当前点
                this.graphics.circle(n * 10 + 5, m * 10 + 5, 4.5);
                this.graphics.fillColor = colors[matrix[m][n]];
                this.graphics.fill();
            }  
        }  
    }  
}